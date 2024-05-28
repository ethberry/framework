import { forwardRef, Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Brackets, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { ZeroAddress } from "ethers";

import { AchievementRuleStatus, ContractEventType, ContractManagerEventType, TokenType } from "@framework/types";
import { testChainId } from "@framework/constants";

import { AchievementRuleEntity } from "./rule.entity";
import { EventHistoryEntity } from "../../../../event-history/event-history.entity";
import { AchievementsItemService } from "../item/item.service";
import { EventHistoryService } from "../../../../event-history/event-history.service";
import { UserService } from "../../../../../infrastructure/user/user.service";
import { ContractService } from "../../../../hierarchy/contract/contract.service";

interface IAchievementRuleAsset {
  tokenType: TokenType;
  contract: string;
  templateId: number;
}

// TODO create limit list for rule eventTypes
@Injectable()
export class AchievementsRuleService {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @InjectRepository(AchievementRuleEntity)
    private readonly achievementRuleEntityRepository: Repository<AchievementRuleEntity>,
    private readonly achievementsItemService: AchievementsItemService,
    @Inject(forwardRef(() => EventHistoryService))
    private readonly eventHistoryService: EventHistoryService,
    private readonly userService: UserService,
    private readonly contractService: ContractService,
    private readonly configService: ConfigService,
  ) {}

  public findOne(
    where: FindOptionsWhere<AchievementRuleEntity>,
    options?: FindOneOptions<AchievementRuleEntity>,
  ): Promise<AchievementRuleEntity | null> {
    return this.achievementRuleEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<AchievementRuleEntity>,
    options?: FindManyOptions<AchievementRuleEntity>,
  ): Promise<Array<AchievementRuleEntity>> {
    return this.achievementRuleEntityRepository.find({ where, ...options });
  }

  public findAllWithRelations(contractId: number, eventType: ContractEventType): Promise<Array<AchievementRuleEntity>> {
    const queryBuilder = this.achievementRuleEntityRepository.createQueryBuilder("rules");
    queryBuilder.leftJoinAndSelect("rules.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");

    // only ACTIVE rules
    queryBuilder.andWhere("rules.achievementStatus = :achievementStatus", {
      achievementStatus: AchievementRuleStatus.ACTIVE,
    });

    // Condition
    queryBuilder.andWhere(
      new Brackets(qb => {
        qb.where(
          new Brackets(qb => {
            qb.andWhere("rules.contractId = :contractId", { contractId });
            qb.andWhere("rules.eventType IS NULL");
          }),
        );
        qb.orWhere(
          new Brackets(qb => {
            qb.andWhere("rules.contractId IS NULL");
            qb.andWhere("rules.eventType = :eventType", { eventType: eventType.toString() });
          }),
        );
        qb.orWhere(
          new Brackets(qb => {
            qb.andWhere("rules.contractId = :contractId", { contractId });
            qb.andWhere("rules.eventType = :eventType", { eventType: eventType.toString() });
          }),
        );
      }),
    );

    return queryBuilder.getMany();
  }

  public async processEvent(id: number): Promise<void> {
    const event = await this.eventHistoryService.findOneWithRelations({ id });

    if (!event) {
      throw new NotFoundException("eventNotFound");
    }

    const { contractId, eventType, eventData } = event;

    // do not check ContractManager's deploy events
    // TODO rename CM's events args account -> addr
    if (!(<any>Object).values(ContractManagerEventType).includes(eventType)) {
      if (eventData && "account" in eventData) {
        const wallet = eventData.account;
        // TODO filter all db.contracts or limit rule events
        const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
        const allContracts = await this.contractService.findAll(
          { chainId },
          {
            select: {
              address: true,
            },
          },
        );

        // Check only user events
        if (wallet !== ZeroAddress && !allContracts.map(c => c.address).includes(wallet.toLowerCase())) {
          const userEntity = await this.userService.findOne({ wallet: wallet.toLowerCase() });

          // find event User
          if (!userEntity) {
            this.loggerService.error("userNotFound", wallet, AchievementsRuleService.name);
            throw new NotFoundException("userNotFound");
          }

          // Find appropriate rules
          const rules = await this.findAllWithRelations(contractId, eventType);
          if (rules.length) {
            // Check each rule condition
            const promises = rules.map(async rule => {
              // CHECK RULE TIMEFRAME
              // TODO fix format and check date
              const ruleStartTime = rule.startTimestamp;
              const ruleEndTime = rule.endTimestamp;
              const timeNow = Date.now();
              if (ruleStartTime !== ruleEndTime && (Number(ruleStartTime) > timeNow || Number(ruleEndTime) < timeNow)) {
                return null;
              }
              const ruleAsset = rule.item;
              // if rule with Asset - compare with event assets
              if (ruleAsset.components) {
                // get Asset from eventData
                const eventAsset = this.getEventTokenAsset(event);
                // if both Assets - check deeper
                if (eventAsset.length) {
                  // Check if any one rule.item == event.item
                  ruleAsset.components.map(asset => {
                    return eventAsset.map(async item => {
                      // if Rule.Asset condition met - create achievementsItem
                      if (asset.tokenType === item.tokenType && asset.contract.address === item.contract) {
                        if (asset.templateId === item.templateId || !asset.templateId) {
                          return this.achievementsItemService.create(userEntity.id, rule.id, event.id);
                        } else {
                          return void 0;
                        }
                      } else {
                        return void 0;
                      }
                    });
                  });
                  return void 0;
                } else {
                  return void 0;
                }
              } else {
                // Rule condition met - create achievementsItem
                return this.achievementsItemService.create(userEntity.id, rule.id, event.id);
              }
            });

            await Promise.allSettled(promises).then(res =>
              res.forEach(value => {
                if (value.status === "rejected") {
                  this.loggerService.error(value.reason);
                }
              }),
            );
          }
        }
      }
    }
  }

  // Get event.Asset data if any
  public getEventTokenAsset(event: EventHistoryEntity): Array<IAchievementRuleAsset> {
    const { token, eventData, parent } = event;
    const eventTokenAsset = [];

    // if event.tokenEntity
    if (token) {
      eventTokenAsset.push({
        tokenType: token.template.contract.contractType || TokenType.NATIVE,
        contract: token.template.contract.address,
        templateId: token.template.id,
      });
      // if event.parent.tokenEntity
    } else if (parent && parent.token) {
      eventTokenAsset.push({
        tokenType: parent.token.template.contract.contractType || TokenType.NATIVE,
        contract: parent.token.template.contract.address,
        templateId: parent.token.template.id,
      });
    } else {
      // try to parse eventData
      if (eventData && "item" in eventData) {
        const { tokenType, token, tokenId } = eventData.item;
        eventTokenAsset.push({
          tokenType: Object.values(TokenType)[~~tokenType],
          contract: token.toLowerCase(),
          templateId: ~~tokenId,
        });
      } else if (eventData && "items" in eventData) {
        // @ts-ignore
        eventData.items.map(item => {
          const { tokenType, token, tokenId } = item;
          return eventTokenAsset.push({
            tokenType: Object.values(TokenType)[~~tokenType],
            contract: token.toLowerCase(),
            templateId: ~~tokenId,
          });
        });
      }
    }
    return eventTokenAsset;
  }
}

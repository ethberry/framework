import { forwardRef, Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { ZeroAddress } from "ethers";

import { AchievementRuleStatus, ContractEventType, TokenType } from "@framework/types";

import { AchievementRuleEntity } from "./rule.entity";
import { EventHistoryEntity } from "../../blockchain/event-history/event-history.entity";
import { AchievementsItemService } from "../item/item.service";
import { EventHistoryService } from "../../blockchain/event-history/event-history.service";
import { UserService } from "../../infrastructure/user/user.service";

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
  ) {}

  public findOne(
    where: FindOptionsWhere<AchievementRuleEntity>,
    options?: FindOneOptions<AchievementRuleEntity>,
  ): Promise<AchievementRuleEntity | null> {
    return this.achievementRuleEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<AchievementRuleEntity>,
    options?: FindOneOptions<AchievementRuleEntity>,
  ): Promise<Array<AchievementRuleEntity>> {
    return this.achievementRuleEntityRepository.find({ where, ...options });
  }

  public findAllWithRelations(contractId: number, eventType: ContractEventType): Promise<Array<AchievementRuleEntity>> {
    const queryBuilder = this.achievementRuleEntityRepository.createQueryBuilder("rules");
    queryBuilder.leftJoinAndSelect("rules.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");

    // we need to get single token for Native, erc20 and erc1155
    // queryBuilder.leftJoinAndSelect(
    //   "item_template.tokens",
    //   "item_tokens",
    //   "item_contract.contractType IN(:...tokenTypes)",
    //   { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    // );

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

    if (eventData && "from" in eventData) {
      const wallet = eventData.from;
      // TODO filter all db.contracts or limit rule events
      // Check only user events
      if (wallet !== ZeroAddress) {
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
          rules.map(async rule => {
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
                        return await this.achievementsItemService.create(userEntity.id, rule.id, event.id);
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
              return await this.achievementsItemService.create(userEntity.id, rule.id, event.id);
            }
          });
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
        tokenType: token.template.contract.contractType,
        contract: token.template.contract.address,
        templateId: token.template.id,
      });
      // if event.parent.tokenEntity
    } else if (parent && parent.token) {
      eventTokenAsset.push({
        tokenType: parent.token.template.contract.contractType,
        contract: parent.token.template.contract.address,
        templateId: parent.token.template.id,
      });
    } else {
      // try to parse eventData
      if (eventData && "item" in eventData) {
        const [tokenType, token, templateId, _amount] = eventData.item;
        eventTokenAsset.push({
          tokenType: Object.values(TokenType)[~~tokenType],
          contract: token.toLowerCase(),
          templateId: ~~templateId,
        });
      } else if (eventData && "items" in eventData) {
        eventData.items.map(item => {
          const [tokenType, token, templateId, _amount] = item;
          return eventTokenAsset.push({
            tokenType: Object.values(TokenType)[~~tokenType],
            contract: token.toLowerCase(),
            templateId: ~~templateId,
          });
        });
      }
    }
    return eventTokenAsset;
  }
}

import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { AchievementRuleStatus, ContractEventType, TokenType } from "@framework/types";

import { AchievementRuleEntity } from "./rule.entity";
import { EventHistoryEntity } from "../../blockchain/event-history/event-history.entity";
import { AchievementsItemService } from "../item/item.service";
import { EventHistoryService } from "../../blockchain/event-history/event-history.service";
import { UserService } from "../../infrastructure/user/user.service";

@Injectable()
export class AchievementsRuleService {
  constructor(
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
    queryBuilder.leftJoinAndSelect(
      "item_template.tokens",
      "item_tokens",
      "item_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    // only ACTIVE rules
    queryBuilder.andWhere("rules.achievementStatus = :achievementStatus", {
      achievementStatus: AchievementRuleStatus.ACTIVE,
    });
    console.log("lookingeventType", eventType);
    // filter contract where event.contract OR (!event.contract &&
    // queryBuilder.andWhere("rules.contractId = :contractId", {
    //   contractId,
    // });
    // AND ("rules"."contract_id" = 402 OR ("rules"."contract_id" IS NULL AND "rules"."event_type" = 'Purchase'))
    // OR ("rules"."event_type" = 'Purchase' AND "rules"."contract_id" IS NULL);

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
    console.log("processEvent", event);
    const { contractId, eventType, eventData } = event;

    if (eventData && "from" in eventData) {
      const wallet = eventData.from;
      console.log("processEventwallet", wallet);
      const userEntity = await this.userService.findOne({ wallet: wallet.toLowerCase() });

      if (!userEntity) {
        throw new NotFoundException("userNotFound");
      }
      console.log("looking");
      const rules = await this.findAllWithRelations(contractId, eventType);
      console.log("processEventrules", rules);
      if (rules.length) {
        // check each rule
        rules.map(rule => {
          const { item } = rule;

          // get Asset data from event
          const eventItemAsset = this.getEventTokenAsset(event);
          console.log("processEventeventItemAsset", eventItemAsset);
          // if both Rule[] and Asset[] then check
          if (item.components.length && eventItemAsset.length) {
            // check if any of rule.item == event.item
            item.components.map(asset => {
              return eventItemAsset.map(async item => {
                if (asset.tokenType === item.tokenType && asset.contract.address === item.contract) {
                  if (!asset.templateId || asset.templateId === item.templateId) {
                    console.log("processEventasset", asset);
                    console.log("processEventitem", item);
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
        });
      }
    }
  }

  // get event.token data if any
  // TODO interface
  public getEventTokenAsset(event: EventHistoryEntity): Array<any> {
    const { token, eventData, parent } = event;

    const eventTokenAsset: Array<any> = [{}];
    // look for event.tokenEntity
    if (token) {
      eventTokenAsset.push({
        tokenType: token.template.contract.contractType,
        contract: token.template.contract.address,
        templateId: token.template.id,
      });
      // or event.parent.tokenEntity
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
      }
      if (eventData && "items" in eventData) {
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

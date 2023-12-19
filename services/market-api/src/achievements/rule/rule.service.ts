import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

import { TokenType } from "@framework/types";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { AchievementRuleEntity } from "./rule.entity";

@Injectable()
export class AchievementRuleService {
  constructor(
    @InjectRepository(AchievementRuleEntity)
    private readonly achievementRuleEntityRepository: Repository<AchievementRuleEntity>,
  ) {}

  public search(userEntity: UserEntity): Promise<[Array<AchievementRuleEntity>, number]> {
    const queryBuilder = this.achievementRuleEntityRepository.createQueryBuilder("rule");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("rule.contract", "contract");
    queryBuilder.leftJoinAndSelect("contract.merchant", "merchant");
    queryBuilder.leftJoinAndSelect("rule.item", "rule_item");
    queryBuilder.leftJoinAndSelect("rule_item.components", "rule_item_components");
    queryBuilder.leftJoinAndSelect("rule_item_components.template", "rule_item_template");
    queryBuilder.leftJoinAndSelect("rule_item_components.contract", "rule_item_contract");
    queryBuilder.leftJoinAndSelect("rule.levels", "levels");
    queryBuilder.leftJoinAndSelect("rule.items", "items");
    queryBuilder.leftJoinAndSelect("levels.reward", "reward");
    queryBuilder.leftJoinAndSelect("reward.components", "reward_components");
    queryBuilder.leftJoinAndSelect("reward_components.template", "reward_template");
    queryBuilder.leftJoinAndSelect("reward_components.contract", "reward_contract");

    queryBuilder.leftJoinAndSelect(
      "reward_template.tokens",
      "reward_tokens",
      "reward_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.leftJoinAndSelect("levels.redemptions", "redemptions", "redemptions.userId = :userId", {
      userId: userEntity.id,
    });

    queryBuilder.orderBy({
      "levels.achievementLevel": "DESC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findAndCount(
    where: FindOptionsWhere<AchievementRuleEntity>,
    options?: FindManyOptions<AchievementRuleEntity>,
  ): Promise<[Array<AchievementRuleEntity>, number]> {
    return this.achievementRuleEntityRepository.findAndCount({ where, ...options });
  }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";

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

    queryBuilder.leftJoinAndSelect("rule.levels", "levels");
    queryBuilder.leftJoinAndSelect("levels.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");
    queryBuilder.leftJoinAndSelect("item_template.tokens", "item_tokens");

    queryBuilder.leftJoinAndSelect("levels.redemptions", "redemptions", "redemptions.userId = :userId", {
      userId: userEntity.id,
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

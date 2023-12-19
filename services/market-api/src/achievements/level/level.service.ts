import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { TokenType } from "@framework/types";

import { AchievementLevelEntity } from "./level.entity";

@Injectable()
export class AchievementLevelService {
  constructor(
    @InjectRepository(AchievementLevelEntity)
    private readonly achievementLevelEntityRepository: Repository<AchievementLevelEntity>,
  ) {}

  public findOne(
    where: FindOptionsWhere<AchievementLevelEntity>,
    options?: FindOneOptions<AchievementLevelEntity>,
  ): Promise<AchievementLevelEntity | null> {
    return this.achievementLevelEntityRepository.findOne({ where, ...options });
  }

  public findOneWithRelations(where: FindOptionsWhere<AchievementLevelEntity>): Promise<AchievementLevelEntity | null> {
    const queryBuilder = this.achievementLevelEntityRepository.createQueryBuilder("achievement");

    queryBuilder.leftJoinAndSelect("achievement.redemptions", "redemptions");

    queryBuilder.leftJoinAndSelect("achievement.reward", "reward");
    queryBuilder.leftJoinAndSelect("reward.components", "reward_components");
    queryBuilder.leftJoinAndSelect("reward_components.contract", "reward_contract");
    queryBuilder.leftJoinAndSelect("reward_components.template", "reward_template");

    queryBuilder.leftJoinAndSelect(
      "reward_template.tokens",
      "reward_tokens",
      "reward_contract.contractType IN(:...tokenTypes)",
      { tokenTypes: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] },
    );

    queryBuilder.andWhere("redemptions.id IS NULL");

    queryBuilder.andWhere("achievement.id = :id", {
      id: where.id,
    });
    return queryBuilder.getOne();
  }
}

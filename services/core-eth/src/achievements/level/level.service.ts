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

    queryBuilder.leftJoinAndSelect("achievement.item", "item");
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

    queryBuilder.andWhere("achievement.id = :id", {
      id: where.id,
    });
    return queryBuilder.getOne();
  }

  // public processEvent(): Promise<number | null> {
  //   const levels = await
  // }
}

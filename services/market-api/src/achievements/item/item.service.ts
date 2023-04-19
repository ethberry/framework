import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AchievementItemEntity } from "./item.entity";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { IAchievementsItemCountDto } from "./interfaces";

@Injectable()
export class AchievementItemService {
  constructor(
    @InjectRepository(AchievementItemEntity)
    private readonly achievementItemEntityRepository: Repository<AchievementItemEntity>,
  ) {}

  public async count(dto: IAchievementsItemCountDto, userEntity: UserEntity): Promise<number> {
    const { achievementType } = dto;

    const queryBuilder = this.achievementItemEntityRepository.createQueryBuilder("item");

    queryBuilder.leftJoin("item.achievementRule", "rule");

    queryBuilder.select();

    queryBuilder.andWhere("item.userId = :userId", {
      userId: userEntity.id,
    });

    if (achievementType) {
      queryBuilder.andWhere("rule.achievementType = :achievementType", {
        achievementType,
      });
    }

    // if (achievementRuleId) {
    //   queryBuilder.andWhere("item.achievementRuleId = :achievementRuleId", {
    //     achievementRuleId,
    //   });
    // }

    return queryBuilder.getCount();
  }
}

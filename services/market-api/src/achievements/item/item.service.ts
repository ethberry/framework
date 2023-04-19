import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

import { ns } from "@framework/constants";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { AchievementItemEntity } from "./item.entity";
import { AchievementItemReport, IAchievementsItemCountDto } from "./interfaces";

@Injectable()
export class AchievementItemService {
  constructor(
    @InjectRepository(AchievementItemEntity)
    private readonly achievementItemEntityRepository: Repository<AchievementItemReport>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async countByRule(userEntity: UserEntity): Promise<AchievementItemReport> {
    const queryString = `
      SELECT achievement_rule_id as achievementRuleId, count(*) as count
      FROM ${ns}.achievement_item item
      WHERE item.user_id = $1
      GROUP BY achievement_rule_id
    `;

    return this.entityManager.query(queryString, [userEntity.id]) as Promise<AchievementItemReport>;
  }

  public async count(dto: IAchievementsItemCountDto, userEntity: UserEntity): Promise<number> {
    const { achievementRuleId } = dto;
    const queryBuilder = this.achievementItemEntityRepository.createQueryBuilder("item");

    queryBuilder.select();

    queryBuilder.andWhere("item.userId = :userId", {
      userId: userEntity.id,
    });

    queryBuilder.andWhere("item.achievementRuleId = :achievementRuleId", {
      achievementRuleId,
    });

    return queryBuilder.getCount();
  }
}

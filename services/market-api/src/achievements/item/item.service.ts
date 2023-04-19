import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

import { ns } from "@framework/constants";

import { UserEntity } from "../../infrastructure/user/user.entity";

type AchievementItemReport = Array<{
  achievementRuleId: number;
  count: number;
}>;

@Injectable()
export class AchievementItemService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async count(userEntity: UserEntity): Promise<AchievementItemReport> {
    const queryString = `
      SELECT achievement_rule_id as achievementRuleId, count(*) as count
      FROM ${ns}.achievement_item item
      WHERE item.user_id = $1
      GROUP BY achievement_rule_id
    `;

    return this.entityManager.query(queryString, [userEntity.id]) as Promise<AchievementItemReport>;
  }
}

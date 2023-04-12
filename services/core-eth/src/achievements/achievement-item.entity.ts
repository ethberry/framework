import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IAchievementItem } from "@framework/types";
import { ns } from "@framework/constants";

import { UserEntity } from "../infrastructure/user/user.entity";
import { AchievementRuleEntity } from "./achievement-rule.entity";

@Entity({ schema: ns, name: "achievement_item" })
export class AchievementItemEntity extends IdDateBaseEntity implements IAchievementItem {
  @Column({ type: "int" })
  public userId: number;

  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({ type: "int" })
  public achievementRuleId: number;

  @JoinColumn()
  @OneToOne(_type => AchievementRuleEntity)
  public achievementRule: AchievementRuleEntity;
}

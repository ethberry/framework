import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IAchievementRedemption } from "@framework/types";
import { ns } from "@framework/constants";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { AchievementLevelEntity } from "../level/level.entity";

@Entity({ schema: ns, name: "achievement_redemption" })
export class AchievementRedemptionEntity extends IdDateBaseEntity implements IAchievementRedemption {
  @Column({ type: "int" })
  public userId: number;

  @JoinColumn()
  @OneToOne(_type => UserEntity)
  public user: UserEntity;

  @Column({ type: "int" })
  public achievementLevelId: number;

  @JoinColumn()
  @OneToOne(_type => AchievementLevelEntity)
  public achievementLevel: AchievementLevelEntity;

  @Column({ type: "int" })
  public claimId: number;

  @JoinColumn()
  @OneToOne(_type => AchievementLevelEntity)
  public achievementLevel: AchievementLevelEntity;
}

import { Column, Entity, JoinColumn, OneToOne, ManyToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IAchievementItem } from "@framework/types";
import { ns } from "@framework/constants";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { AchievementRuleEntity } from "../rule/rule.entity";
import { EventHistoryEntity } from "../../blockchain/event-history/event-history.entity";

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

  @Column({ type: "int" })
  public historyId: number;

  @JoinColumn()
  @ManyToOne(_type => EventHistoryEntity)
  public history?: EventHistoryEntity;
}

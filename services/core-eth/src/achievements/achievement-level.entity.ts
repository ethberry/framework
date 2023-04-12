import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IAchievementLevel } from "@framework/types";
import { ns } from "@framework/constants";

import { AchievementRuleEntity } from "./achievement-rule.entity";

@Entity({ schema: ns, name: "achievement_item" })
export class AchievementLevelEntity extends SearchableEntity implements IAchievementLevel {
  @Column({ type: "int" })
  public achievementRuleId: number;

  @JoinColumn()
  @OneToOne(_type => AchievementRuleEntity)
  public achievementRule: AchievementRuleEntity;

  @Column({ type: "int" })
  public amount: number;
}

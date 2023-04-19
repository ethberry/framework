import { Column, Entity, OneToMany } from "typeorm";

import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IAchievementRule } from "@framework/types";
import { AchievementType } from "@framework/types";
import { ns } from "@framework/constants";

import { AchievementLevelEntity } from "../level/level.entity";

@Entity({ schema: ns, name: "achievement_rule" })
export class AchievementRuleEntity extends SearchableEntity implements IAchievementRule {
  @Column({
    type: "enum",
    enum: AchievementType,
  })
  public achievementType: AchievementType;

  @OneToMany(_type => AchievementLevelEntity, component => component.achievementRule)
  public levels: Array<AchievementLevelEntity>;
}

import { Column, Entity } from "typeorm";

import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IAchievementRule } from "@framework/types";
import { AchievementRulesType } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "achievement_rule" })
export class AchievementRuleEntity extends SearchableEntity implements IAchievementRule {
  @Column({
    type: "enum",
    enum: AchievementRulesType,
  })
  public key: AchievementRulesType;
}

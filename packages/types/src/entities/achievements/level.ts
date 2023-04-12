import type { ISearchable } from "@gemunion/types-collection";

import { IAchievementRule } from "./rule";

export interface IAchievementLevel extends ISearchable {
  achievementRuleId: number;
  achievementRule: IAchievementRule;
  amount: number;
}

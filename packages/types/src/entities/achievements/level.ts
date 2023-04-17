import type { ISearchable } from "@gemunion/types-collection";

import { IAchievementRule } from "./rule";
import { IAsset } from "../blockchain";

export interface IAchievementLevel extends ISearchable {
  achievementRuleId: number;
  achievementRule: IAchievementRule;
  item?: IAsset;
  itemId: number;
  amount: number;
}

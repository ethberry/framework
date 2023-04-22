import type { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "../blockchain";
import { IAchievementRedemption } from "./redemption";
import { IAchievementRule } from "./rule";

export interface IAchievementLevel extends ISearchable {
  achievementRuleId: number;
  achievementRule: IAchievementRule;
  item?: IAsset;
  itemId: number;
  amount: number;
  redemptions?: Array<IAchievementRedemption>;
}

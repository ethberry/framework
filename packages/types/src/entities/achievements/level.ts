import type { ISearchable } from "@gemunion/types-collection";

import type { IAsset } from "../blockchain";
import type { IAchievementRedemption } from "./redemption";
import type { IAchievementRule } from "./rule";

export interface IAchievementLevel extends ISearchable {
  achievementLevel: number;
  achievementRuleId: number;
  achievementRule: IAchievementRule;
  // TODO rename to reward?
  item?: IAsset;
  itemId: number;
  amount: number;
  parameters: any;
  startTimestamp: string;
  endTimestamp: string; // OR null ?
  redemptions?: Array<IAchievementRedemption>;
}

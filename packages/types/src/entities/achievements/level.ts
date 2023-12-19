import type { ISearchable } from "@gemunion/types-collection";

import type { IAsset } from "../blockchain";
import type { IAchievementRedemption } from "./redemption";
import type { IAchievementRule } from "./rule";

export interface IAchievementLevel extends ISearchable {
  achievementLevel: number;
  achievementRuleId: number;
  achievementRule: IAchievementRule;
  // TODO rename to reward?
  reward?: IAsset;
  rewardId: number;
  amount: number;
  parameters: any;
  redemptions?: Array<IAchievementRedemption>;
}

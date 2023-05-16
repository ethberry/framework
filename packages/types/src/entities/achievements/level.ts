import type { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "../blockchain";
import { IAchievementRedemption } from "./redemption";
import { IAchievementRule } from "./rule";

export interface IAchievementLevel extends ISearchable {
  achievementLevel: number;
  achievementRuleId: number;
  achievementRule: IAchievementRule;
  // TODO rename to reward?
  item?: IAsset;
  itemId: number;
  amount: number;
  attributes: any;
  startTimestamp: string;
  endTimestamp: string; // OR null ?
  redemptions?: Array<IAchievementRedemption>;
}

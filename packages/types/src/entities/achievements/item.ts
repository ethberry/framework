import type { IIdDateBase } from "@gemunion/types-collection";

import { IUser } from "../infrastructure";
import { IAchievementRule } from "./rule";

export interface IAchievementItem extends IIdDateBase {
  userId: number;
  user: IUser;
  achievementRuleId: number;
  achievementRule: IAchievementRule;
}

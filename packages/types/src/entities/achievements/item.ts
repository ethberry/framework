import type { IIdDateBase } from "@gemunion/types-collection";

import { IUser } from "../infrastructure";
import { IAchievementRule } from "./rule";
import { IEventHistory } from "../blockchain";

export interface IAchievementItem extends IIdDateBase {
  userId: number;
  user: IUser;
  achievementRuleId: number;
  achievementRule: IAchievementRule;
  historyId: number;
  history?: IEventHistory;
}

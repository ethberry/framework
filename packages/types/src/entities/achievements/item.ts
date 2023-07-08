import type { IIdDateBase } from "@gemunion/types-collection";

import type { IUser } from "../infrastructure";
import type { IAchievementRule } from "./rule";
import type { IEventHistory } from "../blockchain";

export interface IAchievementItem extends IIdDateBase {
  userId: number;
  user: IUser;
  achievementRuleId: number;
  achievementRule: IAchievementRule;
  historyId: number;
  history?: IEventHistory;
}

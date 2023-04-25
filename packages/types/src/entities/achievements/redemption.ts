import type { IIdDateBase } from "@gemunion/types-collection";

import { IUser } from "../infrastructure";
import { IAchievementLevel } from "./level";

export interface IAchievementRedemption extends IIdDateBase {
  userId: number;
  user: IUser;
  achievementLevelId: number;
  achievementLevel: IAchievementLevel;
}

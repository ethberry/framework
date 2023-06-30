import type { IIdDateBase } from "@gemunion/types-collection";

import type { IUser } from "../infrastructure";
import type { IAchievementLevel } from "./level";
import type { IClaim } from "../blockchain";

export interface IAchievementRedemption extends IIdDateBase {
  userId: number;
  user: IUser;
  achievementLevelId: number;
  achievementLevel: IAchievementLevel;
  claimId: number;
  claim: IClaim;
}

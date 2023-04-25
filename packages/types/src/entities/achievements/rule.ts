import type { ISearchable } from "@gemunion/types-collection";

import { IAchievementLevel } from "./level";

export enum AchievementType {
  MARKETPLACE = "MARKETPLACE",
  CRAFT = "CRAFT",
  COLLECTION = "COLLECTION",
  ECOMMERCE = "ECOMMERCE",
}

export interface IAchievementRule extends ISearchable {
  achievementType: AchievementType;
  levels: Array<IAchievementLevel>;
}

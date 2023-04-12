import type { ISearchable } from "@gemunion/types-collection";

export enum AchievementRulesType {
  MARKETPLACE = "MARKETPLACE",
  CRAFT = "CRAFT",
  COLLECTION = "COLLECTION",
  ECOMMERCE = "ECOMMERCE",
}

export interface IAchievementRule extends ISearchable {
  key: AchievementRulesType;
}

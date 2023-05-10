import type { ISearchable } from "@gemunion/types-collection";

import { IAchievementLevel } from "./level";
import { ContractEventType, IContract } from "../blockchain";

export enum AchievementType {
  MARKETPLACE = "MARKETPLACE",
  CRAFT = "CRAFT",
  COLLECTION = "COLLECTION",
  ECOMMERCE = "ECOMMERCE",
}

export enum AchievementRuleStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IAchievementRule extends ISearchable {
  achievementType: AchievementType;
  eventType: ContractEventType | null;
  contractId: number | null;
  contract?: IContract;
  achievementStatus: AchievementRuleStatus;
  levels: Array<IAchievementLevel>;
}

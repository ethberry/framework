import type { ISearchable } from "@gemunion/types-collection";

import type { IAchievementLevel } from "./level";
import { ContractEventType } from "../blockchain";
import type { IAsset, IContract } from "../blockchain";

export enum AchievementType {
  MARKETPLACE = "MARKETPLACE",
  CRAFT = "CRAFT",
  COLLECTION = "COLLECTION",
  ECOMMERCE = "ECOMMERCE",
}

export enum AchievementRuleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IAchievementRule extends ISearchable {
  achievementType: AchievementType;
  contractId: number | null;
  contract?: IContract;
  eventType: ContractEventType | null;
  item?: IAsset;
  itemId: number | null;
  achievementStatus: AchievementRuleStatus;
  levels: Array<IAchievementLevel>;
}

import { InputType } from "@ethberry/types-collection";
import type { ISearchable } from "@ethberry/types-collection";

import type { IAchievementLevel } from "./level";
import { TContractEventType } from "../blockchain";
import type { IAsset, IContract } from "../blockchain";

export enum AchievementRuleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IAchievementRule extends ISearchable {
  contractId: number | null | InputType;
  contract?: IContract;
  eventType: TContractEventType | null;
  item?: IAsset;
  itemId: number | null;
  achievementStatus: AchievementRuleStatus;
  levels: Array<IAchievementLevel>;
  startTimestamp: string;
  endTimestamp: string; // OR null ?
}

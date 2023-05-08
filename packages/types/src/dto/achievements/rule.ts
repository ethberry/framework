import type { ISearchDto } from "@gemunion/types-collection";

import { AchievementRuleStatus, AchievementType, ContractEventType } from "../../entities";

export interface IAchievementRuleSearchDto extends ISearchDto {
  contractIds: Array<number>;
  achievementType: Array<AchievementType>;
  achievementStatus: Array<AchievementRuleStatus>;
  eventType: Array<ContractEventType>;
}

export interface IAchievementRuleAutocompleteDto {
  achievementType: Array<AchievementType>;
  achievementStatus: Array<AchievementRuleStatus>;
}

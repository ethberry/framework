import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { AchievementRuleStatus, AchievementType, ContractEventType } from "../../entities";

export interface IAchievementRuleSearchDto extends ISearchDto {
  contractIds: Array<number>;
  achievementType: Array<AchievementType>;
  achievementStatus: Array<AchievementRuleStatus>;
  eventType: Array<ContractEventType>;
}

export interface IAchievementRuleItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
  templateIds: Array<number>;
  item: IAchievementRuleSearchDto;
}

export interface IAchievementRuleAutocompleteDto {
  achievementType: Array<AchievementType>;
  achievementStatus: Array<AchievementRuleStatus>;
}

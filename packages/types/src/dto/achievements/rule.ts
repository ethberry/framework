import type { ISearchDto } from "@ethberry/types-collection";
import type { TokenType } from "@ethberry/types-blockchain";

import { AchievementRuleStatus, TContractEventType } from "../../entities";

export interface IAchievementRuleSearchDto extends ISearchDto {
  contractIds: Array<number>;
  achievementStatus: Array<AchievementRuleStatus>;
  eventType: Array<TContractEventType>;
}

export interface IAchievementRuleItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
  templateIds: Array<number>;
  item: IAchievementRuleSearchDto;
}

export interface IAchievementRuleAutocompleteDto {
  achievementStatus: Array<AchievementRuleStatus>;
}

import type { ISearchDto } from "@gemunion/types-collection";

import { StakingRuleStatus, TokenType } from "../../../../entities";

export interface IStakingRuleItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

export interface IStakingRuleSearchDto extends ISearchDto {
  stakingRuleStatus: Array<StakingRuleStatus>;
  deposit: IStakingRuleItemSearchDto;
  reward: IStakingRuleItemSearchDto;
}

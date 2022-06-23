import { ISearchDto } from "@gemunion/types-collection";

import { StakeStatus, StakingRuleStatus, TokenType } from "../../../entities";

export interface IStakingRuleItemSearchDto {
  tokenType: Array<TokenType>;
}

export interface IStakingRuleSearchDto extends ISearchDto {
  stakingStatus: Array<StakingRuleStatus>;
  deposit: IStakingRuleItemSearchDto;
  reward: IStakingRuleItemSearchDto;
}

export interface IStakesSearchDto extends ISearchDto {
  stakeStatus: Array<StakeStatus>;
}

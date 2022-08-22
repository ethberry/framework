import { ISearchDto } from "@gemunion/types-collection";

import { StakeStatus, StakingStatus, TokenType } from "../../../../entities";

export interface IStakingItemSearchDto {
  tokenType: Array<TokenType>;
}

export interface IStakingRuleSearchDto extends ISearchDto {
  stakingStatus: Array<StakingStatus>;
  deposit: IStakingItemSearchDto;
  reward: IStakingItemSearchDto;
}

export interface IStakingStakesSearchDto extends ISearchDto {
  account: string;
  stakeStatus: Array<StakeStatus>;
  deposit: IStakingItemSearchDto;
  reward: IStakingItemSearchDto;
}

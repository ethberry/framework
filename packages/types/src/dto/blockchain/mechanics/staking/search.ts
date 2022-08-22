import { ISearchDto } from "@gemunion/types-collection";

import { StakeStatus, StakingStatus, TokenType } from "../../../../entities";

export interface IStakingItemSearchDto {
  tokenType: Array<TokenType>;
  contractId: Array<number>;
  templateId: Array<number>;
  maxPrice: string;
  minPrice: string;
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
  startTimestamp: string;
  endTimestamp: string;
}

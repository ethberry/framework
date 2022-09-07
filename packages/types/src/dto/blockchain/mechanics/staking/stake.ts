import type { ISearchDto } from "@gemunion/types-collection";

import { StakeStatus, TokenType } from "../../../../entities";

export interface IStakingStakeItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
}

export interface IStakingStakesSearchDto extends ISearchDto {
  account: string;
  stakeStatus: Array<StakeStatus>;
  deposit: IStakingStakeItemSearchDto;
  reward: IStakingStakeItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}

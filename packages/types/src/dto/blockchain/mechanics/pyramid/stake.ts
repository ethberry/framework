import type { ISearchDto } from "@gemunion/types-collection";

import { PyramidStakeStatus, TokenType } from "../../../../entities";

export interface IPyramidStakeItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
}

export interface IPyramidStakesSearchDto extends ISearchDto {
  account: string;
  stakeStatus: Array<PyramidStakeStatus>;
  deposit: IPyramidStakeItemSearchDto;
  reward: IPyramidStakeItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}

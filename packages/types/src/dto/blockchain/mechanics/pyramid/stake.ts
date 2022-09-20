import type { ISearchDto } from "@gemunion/types-collection";

import { PyramidRuleStatus, TokenType } from "../../../../entities";

export interface IPyramidStakeItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
}

export interface IPyramidStakesSearchDto extends ISearchDto {
  account: string;
  stakeStatus: Array<PyramidRuleStatus>;
  deposit: IPyramidStakeItemSearchDto;
  reward: IPyramidStakeItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}

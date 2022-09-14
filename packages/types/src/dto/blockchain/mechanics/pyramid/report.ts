import type { ISearchDto } from "@gemunion/types-collection";

import { PyramidStakeStatus, TokenType } from "../../../../entities";

export interface IPyramidReportItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IPyramidReportSearchDto extends ISearchDto {
  deposit: IPyramidReportItemSearchDto;
  reward: IPyramidReportItemSearchDto;
  account: string;
  stakeStatus: Array<PyramidStakeStatus>;
  startTimestamp: string;
  endTimestamp: string;
}

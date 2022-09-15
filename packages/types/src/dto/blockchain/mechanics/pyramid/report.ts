import type { ISearchDto } from "@gemunion/types-collection";

import { PyramidDepositStatus, TokenType } from "../../../../entities";

export interface IPyramidReportItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IPyramidReportSearchDto extends ISearchDto {
  deposit: IPyramidReportItemSearchDto;
  reward: IPyramidReportItemSearchDto;
  account: string;
  pyramidDepositStatus: Array<PyramidDepositStatus>;
  startTimestamp: string;
  endTimestamp: string;
}

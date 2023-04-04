import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { PyramidDepositStatus } from "../../../../entities";

export interface IPyramidReportItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IPyramidReportSearchDto extends ISearchDto {
  deposit: IPyramidReportItemSearchDto;
  reward: IPyramidReportItemSearchDto;
  account: string;
  emptyReward?: boolean;
  pyramidDepositStatus: Array<PyramidDepositStatus>;
  startTimestamp: string;
  endTimestamp: string;
}

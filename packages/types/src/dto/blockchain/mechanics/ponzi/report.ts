import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { PonziDepositStatus } from "../../../../entities";

export interface IPonziReportItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IPonziReportSearchDto extends ISearchDto {
  deposit: IPonziReportItemSearchDto;
  reward: IPonziReportItemSearchDto;
  account: string;
  emptyReward?: boolean;
  ponziDepositStatus: Array<PonziDepositStatus>;
  startTimestamp: string;
  endTimestamp: string;
}

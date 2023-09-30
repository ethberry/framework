import type { IPaginationDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { PonziDepositStatus } from "../../../../entities";

export interface IPonziReportItemSearchDto {
  tokenType: TokenType;
  contractId?: number;
}

export interface IPonziReportSearchDto extends IPaginationDto {
  account: string;
  contractId?: number;
  emptyReward?: boolean;
  ponziDepositStatus: Array<PonziDepositStatus>;
  deposit: IPonziReportItemSearchDto;
  reward: IPonziReportItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}

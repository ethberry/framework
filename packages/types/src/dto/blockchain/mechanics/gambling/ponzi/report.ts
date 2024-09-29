import type { IPaginationDto, InputType } from "@ethberry/types-collection";
import type { TokenType } from "@ethberry/types-blockchain";

import { PonziDepositStatus } from "../../../../../entities";

export interface IPonziReportItemSearchDto {
  tokenType: TokenType;
  contractId?: number | InputType;
}

export interface IPonziReportSearchDto extends IPaginationDto {
  account: string;
  contractId?: number | InputType;
  ponziDepositStatus: Array<PonziDepositStatus>;
  deposit: IPonziReportItemSearchDto;
  reward: IPonziReportItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}

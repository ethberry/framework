import type { IPaginationDto } from "@ethberry/types-collection";
import type { TokenType } from "@ethberry/types-blockchain";

import { PonziDepositStatus } from "../../../../../entities";

export interface IPonziDepositItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
}

export interface IPonziDepositSearchDto extends IPaginationDto {
  account: string;
  ponziDepositStatus: Array<PonziDepositStatus>;
  deposit: IPonziDepositItemSearchDto;
  reward: IPonziDepositItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
  contractIds: Array<number>;
}

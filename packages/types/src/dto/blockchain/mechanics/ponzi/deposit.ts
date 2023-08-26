import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { PonziDepositStatus } from "../../../../entities";

export interface IPonziDepositItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
}

export interface IPonziDepositSearchDto extends ISearchDto {
  account: string;
  emptyReward?: boolean;
  ponziDepositStatus: Array<PonziDepositStatus>;
  deposit: IPonziDepositItemSearchDto;
  reward: IPonziDepositItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}

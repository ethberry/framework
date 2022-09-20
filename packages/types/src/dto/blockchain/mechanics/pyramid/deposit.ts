import type { ISearchDto } from "@gemunion/types-collection";

import { PyramidDepositStatus, TokenType } from "../../../../entities";

export interface IPyramidDepositItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
}

export interface IPyramidDepositSearchDto extends ISearchDto {
  account: string;
  pyramidDepositStatus: Array<PyramidDepositStatus>;
  deposit: IPyramidDepositItemSearchDto;
  reward: IPyramidDepositItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}

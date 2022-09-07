import type { ISearchDto } from "@gemunion/types-collection";

import { StakeStatus, TokenType } from "../../../../entities";

export interface IStakingReportItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IStakingReportSearchDto extends ISearchDto {
  deposit: IStakingReportItemSearchDto;
  reward: IStakingReportItemSearchDto;
  account: string;
  stakeStatus: Array<StakeStatus>;
  startTimestamp: string;
  endTimestamp: string;
}

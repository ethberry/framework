import type { ISearchDto } from "@gemunion/types-collection";

import { StakingDepositStatus, TokenType } from "../../../../entities";

export interface IStakingReportItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IStakingReportSearchDto extends ISearchDto {
  deposit: IStakingReportItemSearchDto;
  reward: IStakingReportItemSearchDto;
  account: string;
  stakingDepositStatus: Array<StakingDepositStatus>;
  startTimestamp: string;
  endTimestamp: string;
}

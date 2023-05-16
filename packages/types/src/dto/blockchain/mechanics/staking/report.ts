import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { StakingDepositStatus } from "../../../../entities";

export interface IStakingReportItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IStakingReportSearchDto extends ISearchDto {
  deposit: IStakingReportItemSearchDto;
  reward: IStakingReportItemSearchDto;
  account: string;
  emptyReward?: boolean;
  stakingDepositStatus: Array<StakingDepositStatus>;
  startTimestamp: string;
  endTimestamp: string;
}

import type { IPaginationDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { StakingDepositStatus } from "../../../../entities";

export interface IStakingReportItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IStakingReportSearchDto extends IPaginationDto {
  account: string;
  emptyReward?: boolean;
  stakingDepositStatus: Array<StakingDepositStatus>;
  deposit: IStakingReportItemSearchDto;
  reward: IStakingReportItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
  contractId: number;
}

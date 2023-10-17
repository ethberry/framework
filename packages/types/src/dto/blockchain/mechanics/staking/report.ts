import type { IPaginationDto, InputType } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { StakingDepositStatus } from "../../../../entities";

export interface IStakingReportItemSearchDto {
  tokenType: TokenType;
  contractId?: number | InputType;
}

export interface IStakingReportSearchDto extends IPaginationDto {
  account: string;
  contractId?: number | InputType;
  emptyReward?: boolean;
  stakingDepositStatus: Array<StakingDepositStatus>;
  deposit: IStakingReportItemSearchDto;
  reward: IStakingReportItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}

import type { IPaginationDto, InputType } from "@ethberry/types-collection";
import type { TokenType } from "@ethberry/types-blockchain";

import { StakingDepositStatus } from "../../../../../entities";

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
  merchantId?: number;
}

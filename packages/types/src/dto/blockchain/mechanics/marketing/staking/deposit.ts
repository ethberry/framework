import type { IPaginationDto } from "@ethberry/types-collection";
import type { TokenType } from "@ethberry/types-blockchain";

import { StakingDepositStatus } from "../../../../../entities";

export interface IStakingDepositItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
}

export interface IStakingDepositSearchDto extends IPaginationDto {
  account: string;
  emptyReward?: boolean;
  stakingDepositStatus: Array<StakingDepositStatus>;
  deposit: IStakingDepositItemSearchDto;
  reward: IStakingDepositItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
  contractIds: Array<number>;
  merchantId?: number;
}

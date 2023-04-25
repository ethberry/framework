import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { StakingDepositStatus } from "../../../../entities";

export interface IStakingDepositItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
}

export interface IStakingDepositSearchDto extends ISearchDto {
  account: string;
  emptyReward?: boolean;
  stakingDepositStatus: Array<StakingDepositStatus>;
  deposit: IStakingDepositItemSearchDto;
  reward: IStakingDepositItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
  contractIds: Array<number>;
}

import type { ISearchDto } from "@gemunion/types-collection";

import { StakingDepositStatus, TokenType } from "../../../../entities";

export interface IStakingDepositItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
}

export interface IStakingDepositSearchDto extends ISearchDto {
  account: string;
  stakingDepositStatus: Array<StakingDepositStatus>;
  deposit: IStakingDepositItemSearchDto;
  reward: IStakingDepositItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}

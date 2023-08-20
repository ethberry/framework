import type { ISearchDto } from "@gemunion/types-collection";

import { StakingRuleStatus, StakingRewardTokenType, StakingDepositTokenType } from "../../../../entities";

export interface IStakingRuleDepositSearchDto {
  tokenType: Array<StakingDepositTokenType>;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

export interface IStakingRuleRewardSearchDto {
  tokenType: Array<StakingRewardTokenType>;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

export interface IStakingRuleSearchDto extends ISearchDto {
  merchantId: number;
  contractIds: Array<number>;
  stakingRuleStatus: Array<StakingRuleStatus>;
  deposit: IStakingRuleDepositSearchDto;
  reward: IStakingRuleRewardSearchDto;
}

import { IStakingDeposit, IStakingRule } from "@framework/types";

export interface IStakingDepositStartData {
  stakingDeposit: IStakingDeposit;
  address: string;
  transactionHash: string;
}

export interface IStakingDepositFinishData {
  stakingDeposit: IStakingDeposit;
  address: string;
  transactionHash: string;
}

export interface IStakingRuleCreatedData {
  stakingRule: IStakingRule;
  address: string;
  transactionHash: string;
}

export interface IStakingRuleUpdatedData {
  stakingRule: IStakingRule;
  address: string;
  transactionHash: string;
}

import { ISearchable } from "@gemunion/types-collection";
import { IStakingRule } from "./staking-rule";

export enum StakeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "FINISH",
}

export interface IStake extends ISearchable {
  owner: string;
  stakeId: string;
  stakeStatus: StakeStatus;
  startTimestamp: string;
  withdrawTimestamp: string;
  multiplier: number;
  stakingRuleId: number;
  stakingRule: IStakingRule;
}

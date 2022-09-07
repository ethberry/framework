import type { IIdDateBase } from "@gemunion/types-collection";

import { IStakingRule } from "./rule";

export enum StakeStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  COMPLETE = "COMPLETE",
}

export interface IStakingStake extends IIdDateBase {
  account: string;
  externalId: string;
  stakeStatus: StakeStatus;
  startTimestamp: string;
  withdrawTimestamp: string;
  multiplier: number;
  stakingRuleId: number;
  stakingRule?: IStakingRule;
}

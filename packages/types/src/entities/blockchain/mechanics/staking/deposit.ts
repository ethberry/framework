import type { IIdDateBase } from "@gemunion/types-collection";

import { IStakingRule } from "./rule";

export enum StakingDepositStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  COMPLETE = "COMPLETE",
}

export interface IStakingDeposit extends IIdDateBase {
  account: string;
  externalId: string;
  stakingDepositStatus: StakingDepositStatus;
  startTimestamp: string;
  withdrawTimestamp: string;
  multiplier: number;
  stakingRuleId: number;
  stakingRule?: IStakingRule;
}

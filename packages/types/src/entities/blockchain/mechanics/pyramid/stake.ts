import type { IIdDateBase } from "@gemunion/types-collection";

import { IPyramidRule } from "./rule";

export enum PyramidStakeStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  COMPLETE = "COMPLETE",
}

export interface IPyramidStake extends IIdDateBase {
  account: string;
  externalId: string;
  stakeStatus: PyramidStakeStatus;
  startTimestamp: string;
  withdrawTimestamp: string;
  multiplier: number;
  pyramidRuleId: number;
  pyramidRule?: IPyramidRule;
}

import type { IIdDateBase } from "@gemunion/types-collection";

import { IPyramidRule } from "./rule";

export enum PyramidRuleStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  COMPLETE = "COMPLETE",
}

export interface IPyramidStake extends IIdDateBase {
  account: string;
  externalId: string;
  stakeStatus: PyramidRuleStatus;
  startTimestamp: string;
  withdrawTimestamp: string;
  multiplier: number;
  pyramidRuleId: number;
  pyramidRule?: IPyramidRule;
}

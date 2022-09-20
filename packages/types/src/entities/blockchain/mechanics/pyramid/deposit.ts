import type { IIdDateBase } from "@gemunion/types-collection";

import { IPyramidRule } from "./rule";

export enum PyramidDepositStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  COMPLETE = "COMPLETE",
}

export interface IPyramidDeposit extends IIdDateBase {
  account: string;
  externalId: string;
  pyramidDepositStatus: PyramidDepositStatus;
  startTimestamp: string;
  withdrawTimestamp: string;
  multiplier: number;
  pyramidRuleId: number;
  pyramidRule?: IPyramidRule;
}

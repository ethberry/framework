import type { IIdDateBase } from "@gemunion/types-collection";

import type { IPonziRule } from "./rule";

export enum PonziRuleStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  COMPLETE = "COMPLETE",
}

export interface IPonziStake extends IIdDateBase {
  account: string;
  externalId: string;
  stakeStatus: PonziRuleStatus;
  startTimestamp: string;
  withdrawTimestamp: string;
  multiplier: number;
  ponziRuleId: number;
  ponziRule?: IPonziRule;
}

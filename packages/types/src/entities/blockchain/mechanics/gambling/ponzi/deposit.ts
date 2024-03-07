import type { IIdDateBase } from "@gemunion/types-collection";

import type { IPonziRule } from "./rule";

export enum PonziDepositStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  COMPLETE = "COMPLETE",
}

export interface IPonziDeposit extends IIdDateBase {
  account: string;
  externalId: string;
  ponziDepositStatus: PonziDepositStatus;
  startTimestamp: string;
  withdrawTimestamp: string;
  multiplier: number;
  ponziRuleId: number;
  ponziRule?: IPonziRule;
}

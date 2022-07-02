import { IContract } from "@gemunion/types-collection";

import { IVestingHistory } from "./vesting-history";

export enum VestingTemplate {
  "LINEAR" = "LINEAR", // 0 -> 25 -> 50 -> 75 -> 100
  "GRADED" = "GRADED", // 0 -> 10 -> 30 -> 60 -> 100
  "CLIFF" = "CLIFF", // 0 -> 100
}

export interface IVesting extends IContract {
  beneficiary: string;
  duration: number;
  startTimestamp: string;
  contractTemplate: VestingTemplate;
  history?: Array<IVestingHistory>;
}

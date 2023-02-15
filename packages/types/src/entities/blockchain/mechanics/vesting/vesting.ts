export enum VestingContractTemplate {
  "LINEAR" = "LINEAR", // 0 -> 25 -> 50 -> 75 -> 100
  "GRADED" = "GRADED", // 0 -> 10 -> 30 -> 60 -> 100
  "CLIFF" = "CLIFF", // 0 -> 100
}

export interface IVestingParams extends Record<string, string | number> {
  account: string;
  startTimestamp: string;
  duration: number;
}

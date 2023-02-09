// import type { IIdDateBase } from "@gemunion/types-collection";

// import { IVestingHistory } from "./history";
// import { IContract } from "../../hierarchy/contract";

export enum VestingContractTemplate {
  "LINEAR" = "LINEAR", // 0 -> 25 -> 50 -> 75 -> 100
  "GRADED" = "GRADED", // 0 -> 10 -> 30 -> 60 -> 100
  "CLIFF" = "CLIFF", // 0 -> 100
}

// export interface IVesting extends IIdDateBase {
//   account: string;
//   duration: number;
//   startTimestamp: string;
//   contractTemplate: VestingContractTemplate;
//   history?: Array<IVestingHistory>;
//   contractId: number;
//   contract?: IContract;
// }

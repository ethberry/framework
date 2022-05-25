import { IContract } from "@gemunion/types-collection";

import { IErc20TokenHistory } from "./token-history";

export enum Erc20VestingTemplate {
  "LINEAR" = "LINEAR", // 0 -> 25 -> 50 -> 75 -> 100
  "GRADED" = "GRADED", // 0 -> 10 -> 30 -> 60 -> 100
  "CLIFF" = "CLIFF", // 0 -> 100
}

export interface IErc20Vesting extends IContract {
  beneficiary: string;
  duration: number;
  startTimestamp: string;
  contractTemplate: Erc20VestingTemplate;
  history?: Array<IErc20TokenHistory>;
}

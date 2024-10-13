import type { IContract } from "@framework/types";

export interface IVestingReleaseData {
  vesting: IContract;
  token: IContract;
  amount: bigint;
}

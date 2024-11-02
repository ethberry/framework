import type { IContract } from "@framework/types";

export interface ILegacyVestingReleaseData {
  vesting: IContract;
  token: IContract;
  amount: string;
}

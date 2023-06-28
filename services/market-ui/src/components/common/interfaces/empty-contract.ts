import type { IContract } from "@framework/types";

export const emptyContract = { id: 1, address: "" } as IContract;

const vestingParameters: Record<string, string | number> = {
  account: "",
  startTimestamp: new Date().toISOString(),
  cliffInMonth: 12,
  monthlyRelease: 1000,
};

export const emptyVestingContract = {
  id: 1,
  address: "",
  parameters: vestingParameters,
} as IContract;

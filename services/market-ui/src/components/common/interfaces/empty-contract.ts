import type { IContract } from "@framework/types";

export const emptyContract = { id: 1, address: "" } as IContract;

const vestingParameters: Record<string, string | number> = {
  account: "",
  duration: 30,
  startTimestamp: new Date().toISOString(),
};

export const emptyVestingContract = {
  id: 1,
  address: "",
  parameters: vestingParameters,
} as IContract;

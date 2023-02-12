import { IContract } from "@framework/types";

export const emptyContract = { id: 1, address: "" } as IContract;

export const emptyVestingContract = {
  id: 1,
  address: "",
  parameters: { account: "", duration: 30, startTimestamp: new Date().toISOString() },
} as IContract;

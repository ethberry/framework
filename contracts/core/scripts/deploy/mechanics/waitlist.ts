import { ethers } from "hardhat";

import { blockAwait, blockAwaitMs } from "@gemunion/contracts-utils";

export async function deployWaitlist(contracts: Record<string, any>) {
  const waitlistFactory = await ethers.getContractFactory("Waitlist");
  contracts.waitlist = await waitlistFactory.deploy();
  await blockAwaitMs(30000);
  await blockAwait();
}

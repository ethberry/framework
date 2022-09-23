import { ethers } from "hardhat";
import { Contract } from "ethers";
import { blockAwait, blockAwaitMs } from "../../utils/blockAwait";

export async function deployWaitlist(contracts: Record<string, Contract>) {
  const waitlistFactory = await ethers.getContractFactory("Waitlist");
  contracts.waitlist = await waitlistFactory.deploy();
  await blockAwaitMs(30000);
  await blockAwait();
}

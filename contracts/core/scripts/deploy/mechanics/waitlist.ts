import { ethers } from "hardhat";
import { Contract } from "ethers";
import { blockAwait, blockAwait2 } from "../../utils/blockAwait";

export async function deployWaitlist(contracts: Record<string, Contract>) {
  const waitlistFactory = await ethers.getContractFactory("Waitlist");
  contracts.waitlist = await waitlistFactory.deploy();
  await blockAwait2(30000);
  await blockAwait();
}

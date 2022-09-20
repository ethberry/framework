import { ethers } from "hardhat";
import { Contract } from "ethers";
import { blockAwait } from "../../utils/blockAwait";

export async function deployWaitlist(contracts: Record<string, Contract>) {
  const waitlistFactory = await ethers.getContractFactory("Waitlist");
  contracts.waitlist = await waitlistFactory.deploy();
  await blockAwait();
}

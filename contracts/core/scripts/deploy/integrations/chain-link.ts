import { ethers } from "hardhat";

import { blockAwait } from "@gemunion/contracts-utils";

export async function deployChainLink(contracts: Record<string, any>) {
  const linkFactory = await ethers.getContractFactory("LinkToken");
  contracts.link = await linkFactory.deploy();
  await blockAwait();
}

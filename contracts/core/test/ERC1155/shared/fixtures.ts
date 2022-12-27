import { ethers } from "hardhat";

import { baseTokenURI, royalty } from "@gemunion/contracts-constants";

export async function deployERC1155(name: string) {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(royalty, baseTokenURI);
}

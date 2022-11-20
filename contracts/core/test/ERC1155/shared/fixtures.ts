import { ethers } from "hardhat";

import { baseTokenURI, royalty } from "../../constants";

export async function deployErc1155Base(name: string) {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(royalty, baseTokenURI);
}

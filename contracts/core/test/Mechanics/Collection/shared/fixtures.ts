import { ethers } from "hardhat";

import { baseTokenURI, batchSize, royalty, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployCollection(name = "ERC721CSimple", batch = batchSize): Promise<any> {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI, batch, owner.address);
}

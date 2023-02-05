import { ethers } from "hardhat";

import { baseTokenURI, royalty, tokenInitialAmount, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployERC721(name = "ERC721Collection") {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI, tokenInitialAmount, owner.address);
}

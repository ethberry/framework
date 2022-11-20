import { ethers } from "hardhat";
import { baseTokenURI, royalty, tokenName, tokenSymbol } from "../../constants";

export async function deployErc721Base(name: string) {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
}

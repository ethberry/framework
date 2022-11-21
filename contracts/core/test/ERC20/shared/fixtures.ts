import { ethers } from "hardhat";
import { amount, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployERC20(name: string) {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol, amount);
}

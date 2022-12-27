import { ethers } from "hardhat";

import { amount, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployERC20(name: string, options: any = {}) {
  const factory = await ethers.getContractFactory(name);
  const args = Object.assign({ tokenName, tokenSymbol, amount }, options);
  return factory.deploy(...Object.values(args));
}

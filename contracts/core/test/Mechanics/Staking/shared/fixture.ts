import "@nomicfoundation/hardhat-toolbox";

import { ethers } from "hardhat";
import { Contract } from "ethers";

export async function deployStaking(name = "Staking"): Promise<Contract> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(1);
}

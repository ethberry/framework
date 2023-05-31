import { Contract } from "ethers";
import { ethers } from "hardhat";

export async function deployDisperse(name = "Disperse"): Promise<Contract> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy();
}

import { ethers } from "hardhat";
import { Contract } from "ethers";

export async function deployContract<T extends Contract>(name: string): Promise<T> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy() as Promise<T>;
}

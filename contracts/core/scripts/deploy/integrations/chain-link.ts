import { ethers } from "hardhat";
import { Contract } from "ethers";

export async function deployChainLink(contracts: Record<string, Contract>) {
  const linkFactory = await ethers.getContractFactory("LinkToken");
  contracts.link = await linkFactory.deploy();
}

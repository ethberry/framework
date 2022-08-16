import { ethers } from "hardhat";
import { Contract } from "ethers";

export async function deploySystem(contracts: Record<string, Contract>) {
  const vestFactory = await ethers.getContractFactory("ContractManager");
  contracts.contractManager = await vestFactory.deploy();

  const exchangeFactory = await ethers.getContractFactory("Exchange");
  contracts.exchange = await exchangeFactory.deploy("Exchange");
}

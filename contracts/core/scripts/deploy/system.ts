import { ethers } from "hardhat";
import { Contract } from "ethers";
import { blockAwait } from "../utils/blockAwait";

export async function deploySystem(contracts: Record<string, Contract>) {
  const vestFactory = await ethers.getContractFactory("ContractManager");
  contracts.contractManager = await vestFactory.deploy();
  await blockAwait(3);
  console.info("contractManager deployed:", contracts.contractManager.address);
  const exchangeFactory = await ethers.getContractFactory("Exchange");
  const exchangeInstance = await exchangeFactory.deploy("Exchange");
  contracts.exchange = exchangeInstance;
  console.info("exchange deployed:", contracts.exchange.address);
  await blockAwait(3);

  const tx = await contracts.contractManager.setFactories(
    [exchangeInstance.address],
    [contracts.contractManager.address],
  );
  console.info("setFactories, tx", tx.hash);
  await blockAwait(3);
}

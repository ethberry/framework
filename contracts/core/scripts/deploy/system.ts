import { ethers } from "hardhat";
import { Contract } from "ethers";

import { blockAwait } from "@gemunion/contracts-utils";
import { METADATA_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

export async function deploySystem(contracts: Record<string, Contract>) {
  const vestFactory = await ethers.getContractFactory("ContractManager");
  contracts.contractManager = await vestFactory.deploy();
  await blockAwait();
  const exchangeFactory = await ethers.getContractFactory("Exchange");
  const exchangeInstance = await exchangeFactory.deploy("Exchange", [], []);
  contracts.exchange = exchangeInstance;
  await blockAwait();

  await contracts.contractManager.addFactory(exchangeInstance.address, MINTER_ROLE);
  await contracts.contractManager.addFactory(exchangeInstance.address, METADATA_ROLE);
  await blockAwait();
}

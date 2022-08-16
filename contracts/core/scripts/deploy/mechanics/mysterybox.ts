import { ethers } from "hardhat";
import { Contract } from "ethers";

import { baseTokenURI, MINTER_ROLE } from "../../../test/constants";

export async function deployMysterybox(contracts: Record<string, Contract>) {
  const mysteryboxFactory = await ethers.getContractFactory("ERC721Mysterybox");
  const mysteryboxInstance = await mysteryboxFactory.deploy("Mysterybox", "LOOT", 100, baseTokenURI);

  await contracts.erc721Simple.grantRole(MINTER_ROLE, mysteryboxInstance.address);
  await contracts.erc721Random.grantRole(MINTER_ROLE, mysteryboxInstance.address);
  await contracts.erc998Random.grantRole(MINTER_ROLE, mysteryboxInstance.address);
  await contracts.erc1155Simple.grantRole(MINTER_ROLE, mysteryboxInstance.address);

  await mysteryboxInstance.grantRole(MINTER_ROLE, contracts.staking.address);
  await mysteryboxInstance.grantRole(MINTER_ROLE, contracts.exchange.address);
  await mysteryboxInstance.grantRole(MINTER_ROLE, contracts.claimProxy.address);

  await contracts.contractManager.setFactories([mysteryboxInstance.address], [contracts.contractManager.address]);

  contracts.mysterybox = mysteryboxInstance;
}

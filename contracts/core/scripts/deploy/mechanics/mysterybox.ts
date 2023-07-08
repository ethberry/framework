import { ethers } from "hardhat";

import { blockAwait } from "@gemunion/contracts-utils";
import { baseTokenURI, MINTER_ROLE } from "@gemunion/contracts-constants";

export async function deployMysterybox(contracts: Record<string, any>) {
  const mysteryboxSimpleFactory = await ethers.getContractFactory("ERC721MysteryBoxSimple");
  const mysteryboxSimpleInstance = await mysteryboxSimpleFactory.deploy("Mysterybox", "MB721", 100, baseTokenURI);
  contracts.erc721MysteryboxSimple = mysteryboxSimpleInstance;
  await blockAwait();

  await contracts.erc721Simple.grantRole(MINTER_ROLE, mysteryboxSimpleInstance.address);
  await contracts.erc721Random.grantRole(MINTER_ROLE, mysteryboxSimpleInstance.address);
  await contracts.erc998Random.grantRole(MINTER_ROLE, mysteryboxSimpleInstance.address);
  await contracts.erc1155Simple.grantRole(MINTER_ROLE, mysteryboxSimpleInstance.address);
  await blockAwait();

  await mysteryboxSimpleInstance.grantRole(MINTER_ROLE, contracts.staking.address);
  await mysteryboxSimpleInstance.grantRole(MINTER_ROLE, contracts.exchange.address);
  await blockAwait();

  await contracts.contractManager.addFactory(mysteryboxSimpleInstance.address, MINTER_ROLE);
  await blockAwait();

  const mysteryboxPausableFactory = await ethers.getContractFactory("ERC721MysteryBoxPausable");
  const mysteryboxPausableInstance = await mysteryboxPausableFactory.deploy("Mysterybox", "MB-P721", 100, baseTokenURI);
  contracts.erc721MysteryboxPausable = mysteryboxPausableInstance;
  await blockAwait();

  await contracts.erc721Simple.grantRole(MINTER_ROLE, mysteryboxPausableInstance.address);
  await contracts.erc721Random.grantRole(MINTER_ROLE, mysteryboxPausableInstance.address);
  await contracts.erc998Random.grantRole(MINTER_ROLE, mysteryboxPausableInstance.address);
  await contracts.erc1155Simple.grantRole(MINTER_ROLE, mysteryboxPausableInstance.address);
  await blockAwait();

  await mysteryboxPausableInstance.grantRole(MINTER_ROLE, contracts.staking.address);
  await mysteryboxPausableInstance.grantRole(MINTER_ROLE, contracts.exchange.address);
  await blockAwait();

  await contracts.contractManager.addFactory(mysteryboxPausableInstance.address, MINTER_ROLE);
  await blockAwait();

  const mysteryboxBlacklistFactory = await ethers.getContractFactory("ERC721MysteryBoxBlacklist");
  const mysteryboxBlacklistInstance = await mysteryboxBlacklistFactory.deploy(
    "Mysterybox",
    "MB-BL721",
    100,
    baseTokenURI,
  );
  contracts.erc721MysteryboxBlacklist = mysteryboxBlacklistInstance;
  await blockAwait();

  await contracts.erc721Simple.grantRole(MINTER_ROLE, mysteryboxBlacklistInstance.address);
  await contracts.erc721Random.grantRole(MINTER_ROLE, mysteryboxBlacklistInstance.address);
  await contracts.erc998Random.grantRole(MINTER_ROLE, mysteryboxBlacklistInstance.address);
  await contracts.erc1155Simple.grantRole(MINTER_ROLE, mysteryboxBlacklistInstance.address);
  await blockAwait();

  await mysteryboxBlacklistInstance.grantRole(MINTER_ROLE, contracts.staking.address);
  await mysteryboxBlacklistInstance.grantRole(MINTER_ROLE, contracts.exchange.address);
  await blockAwait();

  await contracts.contractManager.addFactory(mysteryboxBlacklistInstance.address, MINTER_ROLE);
  await blockAwait();
}

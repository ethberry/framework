import { ethers } from "hardhat";
import { Contract } from "ethers";

import { baseTokenURI, MINTER_ROLE } from "../../../test/constants";
import { blockAwait } from "../../utils/blockAwait";

export async function deployMysterybox(contracts: Record<string, Contract>) {
  const mysteryboxSimpleFactory = await ethers.getContractFactory("ERC721MysteryboxSimple");
  const mysteryboxSimpleInstance = await mysteryboxSimpleFactory.deploy("Mysterybox", "MB721", 100, baseTokenURI);
  await blockAwait();
  contracts.erc721MysteryboxSimple = mysteryboxSimpleInstance;

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

  const mysteryboxPausableFactory = await ethers.getContractFactory("ERC721MysteryboxPausable");
  const mysteryboxPausableInstance = await mysteryboxPausableFactory.deploy("Mysterybox", "MB-P721", 100, baseTokenURI);
  await blockAwait();
  contracts.erc721MysteryboxPausable = mysteryboxPausableInstance;

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
  const mysteryboxBlacklistFactory = await ethers.getContractFactory("ERC721MysteryboxBlacklist");
  const mysteryboxBlacklistInstance = await mysteryboxBlacklistFactory.deploy(
    "Mysterybox",
    "MB-BL721",
    100,
    baseTokenURI,
  );
  await blockAwait();
  contracts.erc721MysteryboxBlacklist = mysteryboxBlacklistInstance;

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

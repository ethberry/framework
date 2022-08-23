import { ethers } from "hardhat";
import { Contract } from "ethers";

import { baseTokenURI, MINTER_ROLE } from "../../../test/constants";
import { blockAwait } from "../../utils/blockAwait";

export async function deployMysterybox(contracts: Record<string, Contract>) {
  const mysteryboxSimpleFactory = await ethers.getContractFactory("ERC721MysteryboxSimple");
  const mysteryboxSimpleInstance = await mysteryboxSimpleFactory.deploy("Mysterybox", "MB721", 100, baseTokenURI);
  await blockAwait(3);

  await contracts.erc721Simple.grantRole(MINTER_ROLE, mysteryboxSimpleInstance.address);
  await contracts.erc721Random.grantRole(MINTER_ROLE, mysteryboxSimpleInstance.address);
  await contracts.erc998Random.grantRole(MINTER_ROLE, mysteryboxSimpleInstance.address);
  await contracts.erc1155Simple.grantRole(MINTER_ROLE, mysteryboxSimpleInstance.address);
  await blockAwait(3);

  await mysteryboxSimpleInstance.grantRole(MINTER_ROLE, contracts.staking.address);
  await mysteryboxSimpleInstance.grantRole(MINTER_ROLE, contracts.exchange.address);
  await blockAwait(3);

  await contracts.contractManager.addFactory(mysteryboxSimpleInstance.address, MINTER_ROLE);

  contracts.erc721MysteryboxSimple = mysteryboxSimpleInstance;
  await blockAwait(3);

  const mysteryboxPausableFactory = await ethers.getContractFactory("ERC721MysteryboxPausable");
  const mysteryboxPausableInstance = await mysteryboxPausableFactory.deploy("Mysterybox", "MB-P721", 100, baseTokenURI);
  await blockAwait(3);

  await contracts.erc721Simple.grantRole(MINTER_ROLE, mysteryboxPausableInstance.address);
  await contracts.erc721Random.grantRole(MINTER_ROLE, mysteryboxPausableInstance.address);
  await contracts.erc998Random.grantRole(MINTER_ROLE, mysteryboxPausableInstance.address);
  await contracts.erc1155Simple.grantRole(MINTER_ROLE, mysteryboxPausableInstance.address);
  await blockAwait(3);

  await mysteryboxPausableInstance.grantRole(MINTER_ROLE, contracts.staking.address);
  await mysteryboxPausableInstance.grantRole(MINTER_ROLE, contracts.exchange.address);
  await blockAwait(3);

  await contracts.contractManager.addFactory(mysteryboxPausableInstance.address, MINTER_ROLE);
  await blockAwait(3);

  contracts.erc721MysteryboxPausable = mysteryboxPausableInstance;

  const mysteryboxBlacklistFactory = await ethers.getContractFactory("ERC721MysteryboxBlacklist");
  const mysteryboxBlacklistInstance = await mysteryboxBlacklistFactory.deploy(
    "Mysterybox",
    "MB-BL721",
    100,
    baseTokenURI,
  );
  await blockAwait(3);

  await contracts.erc721Simple.grantRole(MINTER_ROLE, mysteryboxBlacklistInstance.address);
  await contracts.erc721Random.grantRole(MINTER_ROLE, mysteryboxBlacklistInstance.address);
  await contracts.erc998Random.grantRole(MINTER_ROLE, mysteryboxBlacklistInstance.address);
  await contracts.erc1155Simple.grantRole(MINTER_ROLE, mysteryboxBlacklistInstance.address);
  await blockAwait(3);

  await mysteryboxBlacklistInstance.grantRole(MINTER_ROLE, contracts.staking.address);
  await mysteryboxBlacklistInstance.grantRole(MINTER_ROLE, contracts.exchange.address);
  await blockAwait(3);

  await contracts.contractManager.addFactory(mysteryboxBlacklistInstance.address, MINTER_ROLE);

  contracts.erc721MysteryboxBlacklist = mysteryboxBlacklistInstance;
}

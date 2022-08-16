import { ethers } from "hardhat";
import { Contract } from "ethers";

import { baseTokenURI, royalty } from "../../../test/constants";

export async function deployERC721(contracts: Record<string, Contract>) {
  const erc721SimpleFactory = await ethers.getContractFactory("ERC721Simple");
  contracts.erc721Simple = await erc721SimpleFactory.deploy("RUNE", "GEM721", royalty, baseTokenURI);

  const erc721InactiveFactory = await ethers.getContractFactory("ERC721Simple");
  contracts.erc721Inactive = await erc721InactiveFactory.deploy("ERC721 INACTIVE", "OFF721", royalty, baseTokenURI);

  const erc721NewFactory = await ethers.getContractFactory("ERC721Simple");
  contracts.erc721New = await erc721NewFactory.deploy("ERC721 NEW", "NEW721", royalty, baseTokenURI);

  const erc721BlacklistFactory = await ethers.getContractFactory("ERC721Blacklist");
  contracts.erc721Blacklist = await erc721BlacklistFactory.deploy("ERC721 BLACKLIST", "BL721", royalty, baseTokenURI);

  const ERC721UpgradeableFactory = await ethers.getContractFactory("ERC721Upgradeable");
  contracts.erc721Upgradeable = await ERC721UpgradeableFactory.deploy("ERC721 ARMOUR", "LVL721", royalty, baseTokenURI);

  const erc721RandomFactory = await ethers.getContractFactory("ERC721RandomBesu");
  contracts.erc721Random = await erc721RandomFactory.deploy("ERC721 WEAPON", "RNG721", royalty, baseTokenURI);

  const erc721SoulboundFactory = await ethers.getContractFactory("ERC721Soulbound");
  contracts.erc721Soulbound = await erc721SoulboundFactory.deploy("ERC721 MEDAL", "SB721", royalty, baseTokenURI);
}

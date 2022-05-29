import { ethers } from "hardhat";
import { ContractTransaction } from "ethers";
import { parseEther } from "ethers/lib/utils";

import { MINTER_ROLE } from "../test/constants";
import { blockAwait } from "./utils/blockAwait";
import LINK_TOKEN_ABI from "./abi/link.json";

async function main() {
  const linkContractAddr = "0xD218078f319c4569Cb1BEfA40a728F15Cef0313E"; // besu @linkAddr
  const vrfCoordinatorAddr = "0x5bC13f7Eeae521CDD95Cd000B92E586541cF68CE"; // besu @vrfCoordinatorAddr

  // const maxItemTypes = 15;
  // const maxHeroTypes = 3;
  const rlNum = 100; // royaltyNumerator
  const maxHeroTypes = 3;
  const maxItemTypes = 10;
  const maxSkillTypes = 10;
  let tx: ContractTransaction;
  const [owner] = await ethers.getSigners();

  // Deploy
  // ERC20 Coin Simple
  const coinFactory = await ethers.getContractFactory("ERC20Simple");
  const coinInstance = await coinFactory.deploy("ERC20SimpleCoin", "COINS", 1000000000);
  console.info(`ERC20_COIN_ADDR=${coinInstance.address.toLowerCase()}`);

  // ERC20 Coin
  const coinbFactory = await ethers.getContractFactory("ERC20BlackList");
  const coinbInstance = await coinbFactory.deploy("ERC20BlCoin", "COINB", 1000000000);
  console.info(`ERC20_COIN_BL_ADDR=${coinbInstance.address.toLowerCase()}`);

  // MANAGER
  const vestFactory = await ethers.getContractFactory("ContractManager");
  const vestInstance = await vestFactory.deploy();
  console.info(`CONTRACT_MANAGER_ADDR=${vestInstance.address.toLowerCase()}`);

  // ERC721 contract - Item
  const itemFactory = await ethers.getContractFactory("ERC721RandomTest");
  const itemInstance = await itemFactory.deploy("Item", "ITEM", "https://fw-json-api.gemunion.io/erc721/1/", rlNum);
  console.info(`ERC721_ITEM_ADDR=${itemInstance.address.toLowerCase()}`);

  // ERC721 contract - Hero
  const heroFactory = await ethers.getContractFactory("ERC721RandomTest");
  const heroInstance = await heroFactory.deploy("Hero", "HERO", "https://fw-json-api.gemunion.io/erc721/2/", rlNum);
  console.info(`ERC721_HERO_ADDR=${heroInstance.address.toLowerCase()}`);

  // ERC721 contract - Skill
  const skillFactory = await ethers.getContractFactory("ERC721Graded");
  const skillInstance = await skillFactory.deploy("Skill", "SKILL", "https://fw-json-api.gemunion.io/erc721/3/", rlNum);
  console.info(`ERC721_SKILL_ADDR=${skillInstance.address.toLowerCase()}`);

  // ERC721 contract - Land
  const landFactory = await ethers.getContractFactory("ERC721Simple");
  const landInstance = await landFactory.deploy("Land", "LND", "https://fw-json-api.gemunion.io/erc721/4/", rlNum);
  console.info(`ERC721_LAND_ADDR=${landInstance.address.toLowerCase()}`);

  // ERC721 Marketplace contract
  const market721Factory = await ethers.getContractFactory("ERC721Marketplace");
  const market721Instance = await market721Factory.deploy("ERC721Marketplace");
  console.info(`ERC721_MARKETPLACE_ADDR=${market721Instance.address.toLowerCase()}`);

  // Craft contract - CraftERC721
  const craft721Factory = await ethers.getContractFactory("ERC1155ERC721Craft");
  const craft721Instance = await craft721Factory.deploy();
  console.info(`ERC721_CRAFT_ADDR=${craft721Instance.address.toLowerCase()}`);

  // ERC721 contract - ERC721Dropbox
  const erc721DropFactory = await ethers.getContractFactory("ERC721Dropbox");
  const erc721DropInstance = await erc721DropFactory.deploy(
    "ERC721Dropbox",
    "DBX",
    "https://fw-json-api.gemunion.io/",
    100,
  );
  console.info(`ERC721_DROPBOX_ADDR=${erc721DropInstance.address.toLowerCase()}`);

  // ERC721 contract - ERC721Airdrop
  const airdropboxFactory = await ethers.getContractFactory("ERC721Airdrop");
  const airdropboxInstance = await airdropboxFactory.deploy(
    "ERC721Airdrop",
    "AIRDROP",
    "https://fw-json-api.gemunion.io/",
    100,
    10000,
  );
  console.info(`ERC721_AIRDROP_ADDR=${airdropboxInstance.address.toLowerCase()}`);

  // ERC1155 contract - Resources
  const resFactory = await ethers.getContractFactory("ERC1155Simple");
  const resInstance = await resFactory.deploy("https://fw-json-api.gemunion.io/erc1155/1/");
  console.info(`ERC1155_RESOURCES_ADDR=${resInstance.address.toLowerCase()}`);

  // Craft contract - CraftERC1155
  const craftFactory = await ethers.getContractFactory("ERC1155ERC1155Craft");
  const craftInstance = await craftFactory.deploy();
  console.info(`ERC1155_CRAFT_ADDR=${craftInstance.address.toLowerCase()}`);

  // ERC1155 Marketplace contract
  const market1155Factory = await ethers.getContractFactory("ERC1155Marketplace");
  const market1155Instance = await market1155Factory.deploy("ERC1155Marketplace");
  console.info(`ERC1155_MARKETPLACE_ADDR=${market1155Instance.address.toLowerCase()}`);

  // Setup Contracts
  await blockAwait();

  // ERC721 Collection Hero
  // Grant role to Marketplace in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, market721Instance.address);
  console.info("Hero - MINTER_ROLE granted to Marketplace721: ", tx.hash);
  // Grant role to VRFCoordinator in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, vrfCoordinatorAddr);
  console.info("Hero - MINTER_ROLE granted to VRFCoordinator: ", tx.hash);
  // Grant role to ERC721Airdrop in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, airdropboxInstance.address);
  console.info("Hero - MINTER_ROLE granted to ERC721Airdrop: ", tx.hash);
  // Grant role to ERC721Dropbox in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, erc721DropInstance.address);
  console.info("Hero - MINTER_ROLE granted to ERC721Dropbox: ", tx.hash);
  // Grant role to CraftErc721 in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, craft721Instance.address);
  console.info("Hero - MINTER_ROLE granted to CraftErc721: ", tx.hash);
  // Set max types in Hero
  tx = await heroInstance.setMaxTemplateId(maxHeroTypes);
  console.info("Hero - Set Max types: ", tx.hash);

  // ERC721 Collection Item
  // Grant role to Marketplace in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, market721Instance.address);
  console.info("Item - MINTER_ROLE granted to Marketplace721: ", tx.hash);
  // Grant role to VRFCoordinator in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, vrfCoordinatorAddr);
  console.info("Item - MINTER_ROLE granted to VRFCoordinator: ", tx.hash);
  // Grant role to ERC721Airdrop in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, airdropboxInstance.address);
  console.info("Item - MINTER_ROLE granted to ERC721Airdrop: ", tx.hash);
  // Grant role to ERC721Dropbox in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, erc721DropInstance.address);
  console.info("Item - MINTER_ROLE granted to ERC721Dropbox: ", tx.hash);
  // Grant role to CraftErc721 in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, craft721Instance.address);
  console.info("Item - MINTER_ROLE granted to CraftErc721: ", tx.hash);
  // Set max types in Item
  tx = await itemInstance.setMaxTemplateId(maxItemTypes);
  console.info("Item - Set Max types: ", tx.hash);

  // ERC721 Collection Skill
  // Grant role to Marketplace in Skill
  tx = await skillInstance.grantRole(MINTER_ROLE, market721Instance.address);
  console.info("Skill - MINTER_ROLE granted to Marketplace721: ", tx.hash);
  // Grant role to CraftErc721 in Skill
  tx = await skillInstance.grantRole(MINTER_ROLE, craft721Instance.address);
  console.info("Skill - MINTER_ROLE granted to CraftErc721: ", tx.hash);
  // Grant role to VRFCoordinator in Skill
  // tx = await skillInstance.grantRole(MINTER_ROLE, vrfCoordinatorAddr);
  // console.info("Skill - MINTER_ROLE granted to VRFCoordinator: ", tx.hash);
  // Grant role to ERC721Airdrop in Skill
  // tx = await skillInstance.grantRole(MINTER_ROLE, airdropboxInstance.address);
  // console.info("Skill - MINTER_ROLE granted to ERC721Airdrop: ", tx.hash);
  // // Grant role to ERC721Dropbox in Skill
  // tx = await skillInstance.grantRole(MINTER_ROLE, erc721DropInstance.address);
  // console.info("Skill - MINTER_ROLE granted to ERC721Dropbox: ", tx.hash);
  // Set max types in Skill
  tx = await itemInstance.setMaxTemplateId(maxSkillTypes);
  console.info("Skill - Set Max types: ", tx.hash);

  // ERC721 Dropbox
  // Grant role to Marketplace in Dropbox
  tx = await erc721DropInstance.grantRole(MINTER_ROLE, market721Instance.address);
  console.info("ERC721Dropbox - MINTER_ROLE granted to Marketplace721: ", tx.hash);

  // ERC721 Airdrop
  // Grant role to Marketplace in Airdrop
  tx = await airdropboxInstance.grantRole(MINTER_ROLE, market721Instance.address);
  console.info("ERC721Airdrop - MINTER_ROLE granted to Marketplace721: ", tx.hash);

  // ERC1155 Resources
  // Grant role to Marketplace in Resources
  tx = await resInstance.grantRole(MINTER_ROLE, market1155Instance.address);
  console.info("Resources - MINTER_ROLE granted to Marketplace1155: ", tx.hash);
  // Grant role to Craft in Resources
  tx = await resInstance.grantRole(MINTER_ROLE, craftInstance.address);
  console.info("Resources - MINTER_ROLE granted to Craft: ", tx.hash);
  // Approve Craft in Resources for Owner
  tx = await resInstance.setApprovalForAll(craftInstance.address, true);
  console.info(`Resources - setApprovalForAll for Craft `, tx.hash);

  // Fund LINK to Items
  const linkTokenContract = new ethers.Contract(linkContractAddr, LINK_TOKEN_ABI, owner);
  tx = await linkTokenContract.transfer(itemInstance.address, parseEther("1.0"));
  console.info(`1 LINK transferred to Item: `, tx.hash);
  // Fund LINK to Hero
  tx = await linkTokenContract.transfer(heroInstance.address, parseEther("1.0"));
  console.info(`1 LINK transferred to Hero: `, tx.hash);
  // Fund LINK to Skill
  tx = await linkTokenContract.transfer(skillInstance.address, parseEther("1.0"));
  console.info(`1 LINK transferred to Skill: `, tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

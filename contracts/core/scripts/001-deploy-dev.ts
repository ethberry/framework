import { ethers } from "hardhat";
import { ContractTransaction } from "ethers";
import { parseEther } from "ethers/lib/utils";

import { blockAwait } from "@gemunion/utils-eth";

import { MINTER_ROLE } from "../test/constants";
import LINK_TOKEN_ABI from "./abi/link.json";

async function main() {
  const linkContractAddr = "0xD218078f319c4569Cb1BEfA40a728F15Cef0313E"; // besu @linkAddr
  const vrfCoordinatorAddr = "0x5bC13f7Eeae521CDD95Cd000B92E586541cF68CE"; // besu @vrfCoordinatorAddr

  // const maxItemTypes = 15;
  // const maxHeroTypes = 3;
  const rlNum = 100; // royaltyNumerator
  let tx: ContractTransaction;
  const [owner] = await ethers.getSigners();

  // Deploy
  // ERC20 Simple Active
  const coinActiveFactory = await ethers.getContractFactory("ERC20Simple");
  const coinActiveInstance = await coinActiveFactory.deploy("Space Credits", "GEM20", 1000000000);
  console.info(`ERC20_ACTIVE_ADDR=${coinActiveInstance.address.toLowerCase()}`);

  // ERC20 Simple Inactive
  const coinInactiveFactory = await ethers.getContractFactory("ERC20Simple");
  const coinInactiveInstance = await coinInactiveFactory.deploy("Inactive token", "OFF20", 1000000000);
  console.info(`ERC20_INACTIVE_ADDR=${coinInactiveInstance.address.toLowerCase()}`);

  // ERC20 Simple New
  const coinNewFactory = await ethers.getContractFactory("ERC20Simple");
  const coinNewInstance = await coinNewFactory.deploy("Inactive token", "OFF20", 1000000000);
  console.info(`ERC20_NEW_ADDR=${coinNewInstance.address.toLowerCase()}`);

  // ERC20 Black List
  const coinbFactory = await ethers.getContractFactory("ERC20BlackList");
  const coinbInstance = await coinbFactory.deploy("Black list matters", "BLM20", 1000000000);
  console.info(`ERC20_BLACKLIST_ADDR=${coinbInstance.address.toLowerCase()}`);

  // USDT
  const usdtFactory = await ethers.getContractFactory("TetherToken");
  const usdtInstance = await usdtFactory.deploy(100000000000, "Tether USD", "USDT", 6);
  console.info(`ERC20_USDT_ADDR=${usdtInstance.address.toLowerCase()}`);

  // MANAGER
  const vestFactory = await ethers.getContractFactory("ContractManager");
  const vestInstance = await vestFactory.deploy();
  console.info(`CONTRACT_MANAGER_ADDR=${vestInstance.address.toLowerCase()}`);

  // ERC721 contract - Item
  const itemFactory = await ethers.getContractFactory("ERC721RandomTest");
  const itemInstance = await itemFactory.deploy("Item", "ITEM", rlNum, "https://fw-json-api.gemunion.io/erc721/1/");
  console.info(`ERC721_ITEM_ADDR=${itemInstance.address.toLowerCase()}`);

  // ERC721 contract - Hero
  const heroFactory = await ethers.getContractFactory("ERC721RandomTest");
  const heroInstance = await heroFactory.deploy("Hero", "HERO", rlNum, "https://fw-json-api.gemunion.io/erc721/2/");
  console.info(`ERC721_HERO_ADDR=${heroInstance.address.toLowerCase()}`);

  // ERC721 contract - Skill
  const skillFactory = await ethers.getContractFactory("ERC721Graded");
  const skillInstance = await skillFactory.deploy("Skill", "SKILL", rlNum, "https://fw-json-api.gemunion.io/erc721/3/");
  console.info(`ERC721_SKILL_ADDR=${skillInstance.address.toLowerCase()}`);

  // ERC721 contract - Land
  const landFactory = await ethers.getContractFactory("ERC721Simple");
  const landInstance = await landFactory.deploy("Land", "LND", rlNum, "https://fw-json-api.gemunion.io/erc721/4/");
  console.info(`ERC721_LAND_ADDR=${landInstance.address.toLowerCase()}`);

  // ERC721 Marketplace contract
  const marketFactory = await ethers.getContractFactory("Marketplace");
  const marketInstance = await marketFactory.deploy("Marketplace");
  console.info(`MARKETPLACE_ADDR=${marketInstance.address.toLowerCase()}`);

  // Craft contract - CraftERC721
  const exchangeFactory = await ethers.getContractFactory("ERC1155ERC721Craft");
  const exchangeInstance = await exchangeFactory.deploy();
  console.info(`EXCHANGE_ADDR=${exchangeInstance.address.toLowerCase()}`);

  // ERC721 contract - ERC721Dropbox
  const erc721DropFactory = await ethers.getContractFactory("ERC721Dropbox");
  const erc721DropInstance = await erc721DropFactory.deploy(
    "ERC721Dropbox",
    "DBX",
    100,
    "https://fw-json-api.gemunion.io/",
  );
  console.info(`DROPBOX_ADDR=${erc721DropInstance.address.toLowerCase()}`);

  // ERC721 contract - ERC721Airdrop
  const airdropFactory = await ethers.getContractFactory("ERC721Airdrop");
  const airdropInstance = await airdropFactory.deploy(
    "Airdrop",
    "AIRDROP",
    10000,
    100,
    "https://fw-json-api.gemunion.io/",
  );
  console.info(`AIRDROP_ADDR=${airdropInstance.address.toLowerCase()}`);

  // ERC1155 contract - Resources
  const resFactory = await ethers.getContractFactory("ERC1155Simple");
  const resInstance = await resFactory.deploy("https://fw-json-api.gemunion.io/erc1155/1/");
  console.info(`ERC1155_RESOURCES_ADDR=${resInstance.address.toLowerCase()}`);

  // Setup Contracts
  await blockAwait(ethers.provider);

  // ERC721 Collection Hero
  // Grant role to Marketplace in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, marketInstance.address);
  console.info("Hero - MINTER_ROLE granted to Marketplace721: ", tx.hash);
  // Grant role to VRFCoordinator in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, vrfCoordinatorAddr);
  console.info("Hero - MINTER_ROLE granted to VRFCoordinator: ", tx.hash);
  // Grant role to ERC721Airdrop in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, airdropInstance.address);
  console.info("Hero - MINTER_ROLE granted to ERC721Airdrop: ", tx.hash);
  // Grant role to ERC721Dropbox in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, erc721DropInstance.address);
  console.info("Hero - MINTER_ROLE granted to ERC721Dropbox: ", tx.hash);
  // Grant role to CraftErc721 in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
  console.info("Hero - MINTER_ROLE granted to CraftErc721: ", tx.hash);

  // ERC721 Collection Item
  // Grant role to Marketplace in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, marketInstance.address);
  console.info("Item - MINTER_ROLE granted to Marketplace721: ", tx.hash);
  // Grant role to VRFCoordinator in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, vrfCoordinatorAddr);
  console.info("Item - MINTER_ROLE granted to VRFCoordinator: ", tx.hash);
  // Grant role to ERC721Airdrop in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, airdropInstance.address);
  console.info("Item - MINTER_ROLE granted to ERC721Airdrop: ", tx.hash);
  // Grant role to ERC721Dropbox in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, erc721DropInstance.address);
  console.info("Item - MINTER_ROLE granted to ERC721Dropbox: ", tx.hash);
  // Grant role to CraftErc721 in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
  console.info("Item - MINTER_ROLE granted to CraftErc721: ", tx.hash);

  // ERC721 Collection Skill
  // Grant role to Marketplace in Skill
  tx = await skillInstance.grantRole(MINTER_ROLE, marketInstance.address);
  console.info("Skill - MINTER_ROLE granted to Marketplace721: ", tx.hash);
  // Grant role to CraftErc721 in Skill
  tx = await skillInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
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

  // ERC721 Dropbox
  // Grant role to Marketplace in Dropbox
  tx = await erc721DropInstance.grantRole(MINTER_ROLE, marketInstance.address);
  console.info("ERC721Dropbox - MINTER_ROLE granted to Marketplace721: ", tx.hash);

  // ERC721 Airdrop
  // Grant role to Marketplace in Airdrop
  tx = await airdropInstance.grantRole(MINTER_ROLE, marketInstance.address);
  console.info("ERC721Airdrop - MINTER_ROLE granted to Marketplace721: ", tx.hash);

  // ERC1155 Resources
  // Grant role to Marketplace in Resources
  tx = await resInstance.grantRole(MINTER_ROLE, marketInstance.address);
  console.info("Resources - MINTER_ROLE granted to Marketplace1155: ", tx.hash);
  // Grant role to Craft in Resources
  tx = await resInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
  console.info("Resources - MINTER_ROLE granted to Craft: ", tx.hash);
  // Approve Craft in Resources for Owner
  tx = await resInstance.setApprovalForAll(exchangeInstance.address, true);
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

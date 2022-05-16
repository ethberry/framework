import { ethers } from "hardhat";
import { ContractTransaction } from "ethers";
import { parseEther } from "ethers/lib/utils";

import { MINTER_ROLE } from "../test/constants";
import { blockAwait } from "./utils/blockAwait";
import LINK_TOKEN_ABI from "./abi/link.json";

async function main() {
  const linkContractAddr = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06"; // BINANCE testnet @linkAddr
  const vrfCoordinatorAddr = "0xa555fC018435bef5A13C6c6870a9d4C11DEC329C"; // BINANCE testnet @vrfCoordinatorAddr
  // const maxItemTypes = 15;
  // const maxHeroTypes = 3;
  const rlNum = 100; // royaltyNumerator
  const maxHeroTypes = 3;
  const maxItemTypes = 10;
  const maxSkillTypes = 10;
  let tx: ContractTransaction;
  const [owner] = await ethers.getSigners();

  // Deploy
  // ERC20 Coin
  const coinFactory = await ethers.getContractFactory("Coin");
  const coinInstance = await coinFactory.deploy("Erc20Coin", "COIN", 1000000000);
  console.info(`ERC20_COIN=${coinInstance.address.toLowerCase()}`);

  // ERC20 Vesting Factory
  const vestFactory = await ethers.getContractFactory("VestingFactory");
  const vestInstance = await vestFactory.deploy();
  console.info(`ERC20_VESTING=${vestInstance.address.toLowerCase()}`);

  // ERC721 contract - Item
  const itemFactory = await ethers.getContractFactory("Item");
  const itemInstance = await itemFactory.deploy("Hero", "ITEM", "http://localhost:3011/erc721/1/", rlNum);
  console.info(`ERC721_ITEM_ADDR=${itemInstance.address.toLowerCase()}`);

  // ERC721 contract - Hero
  const heroFactory = await ethers.getContractFactory("Hero");
  const heroInstance = await heroFactory.deploy("Hero", "HERO", "http://localhost:3011/erc721/2/", rlNum);
  console.info(`ERC721_HERO_ADDR=${heroInstance.address.toLowerCase()}`);

  // ERC721 contract - Skill
  const skillFactory = await ethers.getContractFactory("Skill");
  const skillInstance = await skillFactory.deploy("Skill", "SKILL", "http://localhost:3011/erc721/3/", rlNum);
  console.info(`ERC721_SKILL_ADDR=${skillInstance.address.toLowerCase()}`);

  // ERC721 Marketplace contract
  const market721Factory = await ethers.getContractFactory("ERC721Marketplace");
  const market721Instance = await market721Factory.deploy("ERC721Marketplace");
  console.info(`ERC721_MARKETPLACE_ADDR=${market721Instance.address.toLowerCase()}`);

  // Craft contract - ERC1155ERC721Craft
  const craft721Factory = await ethers.getContractFactory("ERC1155ERC721Craft");
  const craft721Instance = await craft721Factory.deploy();
  console.info(`ERC721_CRAFT_ADDR=${craft721Instance.address.toLowerCase()}`);

  // Auction Item contract
  const auctionItemFactory = await ethers.getContractFactory("AuctionERC721");
  const auctionItemInstance = await auctionItemFactory.deploy();
  console.info(`ERC721_AUCTION_ADDR=${auctionItemInstance.address.toLowerCase()}`);

  // ERC721 contract - DropboxERC721
  const erc721DropFactory = await ethers.getContractFactory("DropboxERC721");
  const erc721DropInstance = await erc721DropFactory.deploy("DropboxERC721", "DBX", "http://localhost:3011/", 100);
  console.info(`ERC721_DROPBOX_ADDR=${erc721DropInstance.address.toLowerCase()}`);

  // ERC721 contract - AirDropERC721
  const airdropboxFactory = await ethers.getContractFactory("AirdropERC721");
  const airdropboxInstance = await airdropboxFactory.deploy(
    "AirDropERC721",
    "AIRDROP",
    "http://localhost:3011/",
    100,
    10000,
  );
  console.info(`ERC721_AIRDROP_ADDR=${airdropboxInstance.address.toLowerCase()}`);

  // ERC1155 contract - Resources
  const resFactory = await ethers.getContractFactory("Resources");
  const resInstance = await resFactory.deploy("http://localhost:3011/erc1155/");
  console.info(`ERC1155_RESOURCES_ADDR=${resInstance.address.toLowerCase()}`);

  // Craft contract - ERC1155ERC1155Craft
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
  // Grant role to AirDropERC721 in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, airdropboxInstance.address);
  console.info("Hero - MINTER_ROLE granted to AirDropERC721: ", tx.hash);
  // Grant role to DropboxErc721 in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, erc721DropInstance.address);
  console.info("Hero - MINTER_ROLE granted to DropboxErc721: ", tx.hash);
  // Grant role to ERC1155ERC721Craft in Hero
  tx = await heroInstance.grantRole(MINTER_ROLE, craft721Instance.address);
  console.info("Hero - MINTER_ROLE granted to ERC1155ERC721Craft: ", tx.hash);
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
  // Grant role to AirDropERC721 in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, airdropboxInstance.address);
  console.info("Item - MINTER_ROLE granted to AirDropERC721: ", tx.hash);
  // Grant role to DropboxErc721 in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, erc721DropInstance.address);
  console.info("Item - MINTER_ROLE granted to DropboxErc721: ", tx.hash);
  // Grant role to ERC1155ERC721Craft in Item
  tx = await itemInstance.grantRole(MINTER_ROLE, craft721Instance.address);
  console.info("Item - MINTER_ROLE granted to ERC1155ERC721Craft: ", tx.hash);
  // Set max types in Item
  tx = await itemInstance.setMaxTemplateId(maxItemTypes);
  console.info("Item - Set Max types: ", tx.hash);

  // ERC721 Collection Skill
  // Grant role to Marketplace in Skill
  tx = await skillInstance.grantRole(MINTER_ROLE, market721Instance.address);
  console.info("Skill - MINTER_ROLE granted to Marketplace721: ", tx.hash);
  // Grant role to ERC1155ERC721Craft in Skill
  tx = await skillInstance.grantRole(MINTER_ROLE, craft721Instance.address);
  console.info("Skill - MINTER_ROLE granted to ERC1155ERC721Craft: ", tx.hash);
  // Grant role to VRFCoordinator in Skill
  // tx = await skillInstance.grantRole(MINTER_ROLE, vrfCoordinatorAddr);
  // console.info("Skill - MINTER_ROLE granted to VRFCoordinator: ", tx.hash);
  // Grant role to AirDropERC721 in Skill
  // tx = await skillInstance.grantRole(MINTER_ROLE, airdropboxInstance.address);
  // console.info("Skill - MINTER_ROLE granted to AirDropERC721: ", tx.hash);
  // // Grant role to DropboxErc721 in Skill
  // tx = await skillInstance.grantRole(MINTER_ROLE, erc721DropInstance.address);
  // console.info("Skill - MINTER_ROLE granted to DropboxErc721: ", tx.hash);
  // Set max types in Skill
  tx = await itemInstance.setMaxTemplateId(maxSkillTypes);
  console.info("Skill - Set Max types: ", tx.hash);

  // ERC721 Dropbox
  // Grant role to Marketplace in Dropbox
  tx = await erc721DropInstance.grantRole(MINTER_ROLE, market721Instance.address);
  console.info("DropboxErc721 - MINTER_ROLE granted to Marketplace721: ", tx.hash);

  // ERC721 Airdrop
  // Grant role to Marketplace in Airdrop
  tx = await airdropboxInstance.grantRole(MINTER_ROLE, market721Instance.address);
  console.info("AirdropErc721 - MINTER_ROLE granted to Marketplace721: ", tx.hash);

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

  // Auction Erc721
  // Whitelist Items in Auction
  tx = await auctionItemInstance.whitelist(itemInstance.address);
  console.info("Auction - Items contract whitelisted: ", tx.hash);
  // Whitelist Hero in Auction
  tx = await auctionItemInstance.whitelist(heroInstance.address);
  console.info("Auction - Hero contract whitelisted: ", tx.hash);
  // Whitelist Skill in Auction
  tx = await auctionItemInstance.whitelist(skillInstance.address);
  console.info("Auction - Skill contract whitelisted: ", tx.hash);

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

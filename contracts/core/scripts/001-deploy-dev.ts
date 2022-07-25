import { ethers } from "hardhat";

import { royalty, baseTokenURI } from "../test/constants";
import { wallet, wallets } from "@gemunion/constants";

let exchangeAddr = "";

async function deploySystem() {
  const vestFactory = await ethers.getContractFactory("ContractManager");
  const vestInstance = await vestFactory.deploy();
  console.info(`CONTRACT_MANAGER_ADDR=${vestInstance.address.toLowerCase()}`);

  const exchangeFactory = await ethers.getContractFactory("Exchange");
  const exchangeInstance = await exchangeFactory.deploy("Exchange");
  exchangeAddr = exchangeInstance.address.toLowerCase();
  console.info(`EXCHANGE_ADDR=${exchangeInstance.address.toLowerCase()}`);
}

async function deployERC20() {
  const [owner] = await ethers.getSigners();
  const amount = ethers.constants.WeiPerEther.mul(1e6);

  const coinActiveFactory = await ethers.getContractFactory("ERC20Simple");
  const coinActiveInstance = await coinActiveFactory.deploy("Space Credits", "GEM20", amount);
  await coinActiveInstance.mint(owner.address, amount);
  await coinActiveInstance.approve(exchangeAddr, amount);
  console.info(`ERC20_ACTIVE_ADDR=${coinActiveInstance.address.toLowerCase()}`);

  const coinInactiveFactory = await ethers.getContractFactory("ERC20Simple");
  const coinInactiveInstance = await coinInactiveFactory.deploy("Inactive token", "OFF20", amount);
  console.info(`ERC20_INACTIVE_ADDR=${coinInactiveInstance.address.toLowerCase()}`);

  const coinNewFactory = await ethers.getContractFactory("ERC20Simple");
  const coinNewInstance = await coinNewFactory.deploy("Inactive token", "OFF20", amount);
  console.info(`ERC20_NEW_ADDR=${coinNewInstance.address.toLowerCase()}`);

  const coinBlackFactory = await ethers.getContractFactory("ERC20Blacklist");
  const coinBlackInstance = await coinBlackFactory.deploy("Black list matters", "BLM20", amount);
  await coinBlackInstance.blacklist(wallets[1]);
  await coinBlackInstance.blacklist(wallets[2]);
  console.info(`ERC20_BLACKLIST_ADDR=${coinBlackInstance.address.toLowerCase()}`);

  const usdtFactory = await ethers.getContractFactory("TetherToken");
  const usdtInstance = await usdtFactory.deploy(100000000000, "Tether USD", "USDT", 6);
  console.info(`ERC20_USDT_ADDR=${usdtInstance.address.toLowerCase()}`);
}

async function deployERC721() {
  const runeFactory = await ethers.getContractFactory("ERC721Simple");
  const runeInstance = await runeFactory.deploy("Rune", "RUNE", royalty, baseTokenURI);
  console.info(`ERC721_SIMPLE_ADDR=${runeInstance.address.toLowerCase()}`);

  const skullsFactory = await ethers.getContractFactory("ERC721Blacklist");
  const skullsInstance = await skullsFactory.deploy("Rune", "RUNE", royalty, baseTokenURI);
  console.info(`ERC721_BLACKLIST_ADDR=${skullsInstance.address.toLowerCase()}`);

  const skillFactory = await ethers.getContractFactory("ERC721Graded");
  const skillInstance = await skillFactory.deploy("Skill", "SKILL", royalty, baseTokenURI);
  console.info(`ERC721_GRADED_ADDR=${skillInstance.address.toLowerCase()}`);

  const itemFactory = await ethers.getContractFactory("ERC721RandomTest");
  const itemInstance = await itemFactory.deploy("Item", "ITEM", royalty, baseTokenURI);
  console.info(`ERC721_RANDOM_ADDR=${itemInstance.address.toLowerCase()}`);
}

async function deployERC998() {
  const itemFactory = await ethers.getContractFactory("ERC998RandomTest");
  const itemInstance = await itemFactory.deploy("Hero", "HERO", royalty, baseTokenURI);
  console.info(`ERC998_RANDOM_ADDR=${itemInstance.address.toLowerCase()}`);
}

async function deployERC1155() {
  const itemFactory = await ethers.getContractFactory("ERC1155Simple");
  const itemInstance = await itemFactory.deploy(royalty, baseTokenURI);
  console.info(`ERC1155_SIMPLE_ADDR=${itemInstance.address.toLowerCase()}`);

  const skillFactory = await ethers.getContractFactory("ERC1155Simple");
  const skillInstance = await skillFactory.deploy(royalty, baseTokenURI);
  console.info(`ERC1155_INACTIVE_ADDR=${skillInstance.address.toLowerCase()}`);

  const runeFactory = await ethers.getContractFactory("ERC1155Blacklist");
  const runeInstance = await runeFactory.deploy(royalty, baseTokenURI);
  console.info(`ERC1155_BLACKLIST_ADDR=${runeInstance.address.toLowerCase()}`);
}

// MODULE:VESTING
async function deployVesting() {
  const timestamp = Math.ceil(Date.now() / 1000);

  const linearVestingFactory = await ethers.getContractFactory("LinearVesting");
  const linearVestingInstance = await linearVestingFactory.deploy(wallet, timestamp, 365 * 86400);
  console.info(`VESTING_LINEAR_ADDR=${linearVestingInstance.address.toLowerCase()}`);

  const gradedVestingFactory = await ethers.getContractFactory("GradedVesting");
  const gradedVestingInstance = await gradedVestingFactory.deploy(wallet, timestamp, 365 * 86400);
  console.info(`VESTING_GRADED_ADDR=${gradedVestingInstance.address.toLowerCase()}`);

  const cliffVestingFactory = await ethers.getContractFactory("CliffVesting");
  const cliffVestingInstance = await cliffVestingFactory.deploy(wallet, timestamp, 365 * 86400);
  console.info(`VESTING_CLIFF_ADDR=${cliffVestingInstance.address.toLowerCase()}`);
}

async function deployModules() {
  await deployVesting();

  // MODULE:LOOTBOX
  const lootboxFactory = await ethers.getContractFactory("ERC721Lootbox");
  const lootboxInstance = await lootboxFactory.deploy("Lootbox", "LOOT", 100, baseTokenURI);
  console.info(`LOOTBOX_ADDR=${lootboxInstance.address.toLowerCase()}`);

  // MODULE:CLAIM
  const claimFactory = await ethers.getContractFactory("ClaimProxy");
  const claimInstance = await claimFactory.deploy();
  console.info(`CLAIM_PROXY_ADDR=${claimInstance.address.toLowerCase()}`);

  // MODULE:STAKING
  const stakingFactory = await ethers.getContractFactory("Staking");
  const stakingInstance = await stakingFactory.deploy(10);
  console.info(`STAKING_ADDR=${stakingInstance.address.toLowerCase()}`);
}

async function main() {
  await deploySystem();
  await deployERC20();
  await deployERC721();
  await deployERC998();
  await deployERC1155();
  await deployModules();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

import { ethers } from "hardhat";
import { Contract } from "ethers";

import { baseTokenURI, MINTER_ROLE, royalty } from "../test/constants";
import { wallet, wallets } from "@gemunion/constants";

const contracts: Record<string, Contract> = {};

async function deploySystem() {
  const vestFactory = await ethers.getContractFactory("ContractManager");
  contracts.contractManager = await vestFactory.deploy();

  const exchangeFactory = await ethers.getContractFactory("Exchange");
  contracts.exchange = await exchangeFactory.deploy("Exchange");
}

async function deployERC20() {
  const [owner] = await ethers.getSigners();
  const amount = ethers.constants.WeiPerEther.mul(1e6);

  const erc20SimpleFactory = await ethers.getContractFactory("ERC20Simple");
  const erc20SimpleInstance = await erc20SimpleFactory.deploy("Space Credits", "GEM20", amount);
  await erc20SimpleInstance.mint(owner.address, amount);
  await erc20SimpleInstance.approve(contracts.exchange.address.toLowerCase(), amount);
  contracts.erc20Active = erc20SimpleInstance;

  const erc20InactiveFactory = await ethers.getContractFactory("ERC20Simple");
  contracts.erc20Inactive = await erc20InactiveFactory.deploy("Inactive token", "OFF20", amount);

  const erc20NewFactory = await ethers.getContractFactory("ERC20Simple");
  contracts.erc20New = await erc20NewFactory.deploy("Inactive token", "OFF20", amount);

  const erc20BlacklistFactory = await ethers.getContractFactory("ERC20Blacklist");
  const erc20BlacklistInstance = await erc20BlacklistFactory.deploy("Black list matters", "BLM20", amount);
  await erc20BlacklistInstance.blacklist(wallets[1]);
  await erc20BlacklistInstance.blacklist(wallets[2]);
  contracts.erc20Blacklist = erc20BlacklistInstance;

  const erc20usdtFactory = await ethers.getContractFactory("TetherToken");
  contracts.erc20Usdt = await erc20usdtFactory.deploy(100000000000, "Tether USD", "USDT", 6);
}

async function deployERC721() {
  const erc721SimpleFactory = await ethers.getContractFactory("ERC721Simple");
  contracts.erc721Simple = await erc721SimpleFactory.deploy("Rune", "RUNE", royalty, baseTokenURI);

  const erc721InactiveFactory = await ethers.getContractFactory("ERC721Simple");
  contracts.erc721Inactive = await erc721InactiveFactory.deploy("Rune", "RUNE", royalty, baseTokenURI);

  const erc721NewFactory = await ethers.getContractFactory("ERC721Simple");
  contracts.erc721Simple = await erc721NewFactory.deploy("Rune", "RUNE", royalty, baseTokenURI);

  const erc721BlacklistFactory = await ethers.getContractFactory("ERC721Blacklist");
  contracts.erc721Blacklist = await erc721BlacklistFactory.deploy("Rune", "RUNE", royalty, baseTokenURI);

  const ERC721UpgradeableFactory = await ethers.getContractFactory("ERC721Upgradeable");
  contracts.ERC721Upgradeable = await ERC721UpgradeableFactory.deploy("Skill", "SKILL", royalty, baseTokenURI);

  const erc721RandomFactory = await ethers.getContractFactory("ERC721RandomBesu");
  contracts.erc721Random = await erc721RandomFactory.deploy("Item", "ITEM", royalty, baseTokenURI);
}

async function deployERC998() {
  const erc998RandomFactory = await ethers.getContractFactory("ERC998RandomTest");
  contracts.erc998Random = await erc998RandomFactory.deploy("Hero", "HERO", royalty, baseTokenURI);
}

async function deployERC1155() {
  const erc1155SimpleFactory = await ethers.getContractFactory("ERC1155Simple");
  contracts.erc1155Simple = await erc1155SimpleFactory.deploy(royalty, baseTokenURI);

  const erc1155InactiveFactory = await ethers.getContractFactory("ERC1155Simple");
  contracts.erc1155Inactive = await erc1155InactiveFactory.deploy(royalty, baseTokenURI);

  const erc1155NewFactory = await ethers.getContractFactory("ERC1155Simple");
  contracts.erc1155New = await erc1155NewFactory.deploy(royalty, baseTokenURI);

  const erc1155BlacklistFactory = await ethers.getContractFactory("ERC1155Blacklist");
  contracts.erc1155Blacklist = await erc1155BlacklistFactory.deploy(royalty, baseTokenURI);
}

// MODULE:VESTING
async function deployVesting() {
  const timestamp = Math.ceil(Date.now() / 1000);

  const linearVestingFactory = await ethers.getContractFactory("LinearVesting");
  contracts.vestingLinear = await linearVestingFactory.deploy(wallet, timestamp, 365 * 86400);

  const gradedVestingFactory = await ethers.getContractFactory("GradedVesting");
  contracts.vestingGraded = await gradedVestingFactory.deploy(wallet, timestamp, 365 * 86400);

  const cliffVestingFactory = await ethers.getContractFactory("CliffVesting");
  contracts.vestingCliff = await cliffVestingFactory.deploy(wallet, timestamp, 365 * 86400);
}

// MODULE:LOOTBOX
async function deployLootbox() {
  const lootboxFactory = await ethers.getContractFactory("ERC721Lootbox");
  const lootboxInstance = await lootboxFactory.deploy("Lootbox", "LOOT", 100, baseTokenURI);
  contracts.lootbox = lootboxInstance;

  await contracts.erc721Simple.grantRole(MINTER_ROLE, lootboxInstance.address);
  await contracts.erc721Random.grantRole(MINTER_ROLE, lootboxInstance.address);
  await contracts.erc998Random.grantRole(MINTER_ROLE, lootboxInstance.address);
  await contracts.erc1155Simple.grantRole(MINTER_ROLE, lootboxInstance.address);
}

async function deployModules() {
  await deployVesting();
  await deployLootbox();

  // MODULE:CLAIM
  const claimFactory = await ethers.getContractFactory("ClaimProxy");
  contracts.claimProxy = await claimFactory.deploy();

  // MODULE:STAKING
  const stakingFactory = await ethers.getContractFactory("Staking");
  contracts.staking = await stakingFactory.deploy(10);
}

async function main() {
  await deploySystem();
  await deployERC20();
  await deployERC721();
  await deployERC998();
  await deployERC1155();
  await deployModules();
}

const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter}`);

main()
  .then(() => {
    Object.entries(contracts).map(([key, value]) =>
      console.info(`${camelToSnakeCase(key).toUpperCase()}_ADDR=${value.address.toLowerCase()}`),
    );
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

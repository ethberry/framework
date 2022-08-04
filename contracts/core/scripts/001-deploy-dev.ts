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
  contracts.erc20Simple = erc20SimpleInstance;

  const erc20InactiveFactory = await ethers.getContractFactory("ERC20Simple");
  contracts.erc20Inactive = await erc20InactiveFactory.deploy("ERC20 INACTIVE", "OFF20", amount);

  const erc20NewFactory = await ethers.getContractFactory("ERC20Simple");
  contracts.erc20New = await erc20NewFactory.deploy("ERC20 NEW", "NEW20", amount);

  const erc20BlacklistFactory = await ethers.getContractFactory("ERC20Blacklist");
  const erc20BlacklistInstance = await erc20BlacklistFactory.deploy("ERC20 BLACKLIST", "BL20", amount);
  await erc20BlacklistInstance.blacklist(wallets[1]);
  await erc20BlacklistInstance.blacklist(wallets[2]);
  contracts.erc20Blacklist = erc20BlacklistInstance;

  const erc20usdtFactory = await ethers.getContractFactory("TetherToken");
  contracts.erc20Usdt = await erc20usdtFactory.deploy(100000000000, "Tether USD", "USDT", 6);
}

async function deployERC721() {
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
}

async function deployERC998() {
  const erc998SimpleFactory = await ethers.getContractFactory("ERC998Simple");
  contracts.erc998Simple = await erc998SimpleFactory.deploy("ERC998 SIMPLE", "GEM998", royalty, baseTokenURI);

  const erc998InactiveFactory = await ethers.getContractFactory("ERC998Simple");
  contracts.erc998Inactive = await erc998InactiveFactory.deploy("ERC998 INACTIVE", "OFF998", royalty, baseTokenURI);

  const erc998NewFactory = await ethers.getContractFactory("ERC998Simple");
  contracts.erc998New = await erc998NewFactory.deploy("ERC998 NEW", "NEW998", royalty, baseTokenURI);

  const erc998BlacklistFactory = await ethers.getContractFactory("ERC998Blacklist");
  contracts.erc998Blacklist = await erc998BlacklistFactory.deploy("ERC998 BLACKLIST", "BL998", royalty, baseTokenURI);

  const ERC998UpgradeableFactory = await ethers.getContractFactory("ERC998Upgradeable");
  contracts.erc998Upgradeable = await ERC998UpgradeableFactory.deploy(
    "ERC998 UPGRADEABLE",
    "LVL998",
    royalty,
    baseTokenURI,
  );

  const erc998RandomFactory = await ethers.getContractFactory("ERC998RandomBesu");
  const erc20BlacklistInstance = await erc998RandomFactory.deploy("ERC998 HERO", "RNG998", royalty, baseTokenURI);
  await erc20BlacklistInstance.whiteListChild(contracts.erc721Random.child, 5);
  contracts.erc998Random = erc20BlacklistInstance;
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

// MODULE:MYSTERYBOX
async function deployMysterybox() {
  const mysteryboxFactory = await ethers.getContractFactory("ERC721Mysterybox");
  const mysteryboxInstance = await mysteryboxFactory.deploy("Mysterybox", "LOOT", 100, baseTokenURI);
  contracts.mysterybox = mysteryboxInstance;

  await contracts.erc721Simple.grantRole(MINTER_ROLE, mysteryboxInstance.address);
  await contracts.erc721Random.grantRole(MINTER_ROLE, mysteryboxInstance.address);
  await contracts.erc998Random.grantRole(MINTER_ROLE, mysteryboxInstance.address);
  await contracts.erc1155Simple.grantRole(MINTER_ROLE, mysteryboxInstance.address);
}

// MODULE:STAKING
async function deployStaking() {
  const stakingFactory = await ethers.getContractFactory("Staking");
  const stakingInstance = await stakingFactory.deploy(10);

  await stakingInstance.setRules([
    {
      externalId: 23,
      deposit: {
        tokenType: 1,
        token: contracts.erc20Simple.address,
        tokenId: 0,
        amount: ethers.constants.WeiPerEther,
      },
      reward: {
        tokenType: 2,
        token: contracts.erc721Random.address,
        tokenId: 13101,
        amount: 1,
      },
      period: 30 * 84600,
      penalty: 1,
      recurrent: false,
      active: true,
    },
  ]);

  contracts.staking = stakingInstance;
}

async function deployModules() {
  await deployVesting();
  await deployMysterybox();
  await deployStaking();

  // MODULE:CLAIM
  const claimFactory = await ethers.getContractFactory("ClaimProxy");
  contracts.claimProxy = await claimFactory.deploy();
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

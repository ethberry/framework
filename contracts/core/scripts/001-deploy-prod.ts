import { ethers } from "hardhat";
import { Contract } from "ethers";

import { baseTokenURI, MINTER_ROLE } from "../test/constants";
import { wallet } from "@gemunion/constants";

const contracts: Record<string, Contract> = {};

async function deploySystem() {
  const vestFactory = await ethers.getContractFactory("ContractManager");
  contracts.contractManager = await vestFactory.deploy();

  const exchangeFactory = await ethers.getContractFactory("Exchange");
  contracts.exchange = await exchangeFactory.deploy("Exchange");
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

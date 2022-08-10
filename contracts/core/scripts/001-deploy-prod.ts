import { ethers } from "hardhat";
import { Contract } from "ethers";

import { baseTokenURI, MINTER_ROLE } from "../test/constants";
import { wallet } from "@gemunion/constants";
import { ContractManager } from "../typechain-types";
import { blockAwait } from "./utils/blockAwait";

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

// MODULE:MYSTERYBOX
async function deployMysterybox() {
  const mysteryboxFactory = await ethers.getContractFactory("ERC721Mysterybox");
  contracts.mysterybox = await mysteryboxFactory.deploy("Mysterybox", "LOOT", 100, baseTokenURI);
}

async function deployModules() {
  await deployVesting();
  await deployMysterybox();

  // MODULE:CLAIM
  const claimFactory = await ethers.getContractFactory("ClaimProxy");
  contracts.claimProxy = await claimFactory.deploy();

  // MODULE:STAKING
  const stakingFactory = await ethers.getContractFactory("Staking");
  contracts.staking = await stakingFactory.deploy(10);
}

async function setFactories() {
  await deployModules();
  await blockAwait();
  // MODULE:CM
  const vestFactory = await ethers.getContractFactory("ContractManager");
  const cM: ContractManager = vestFactory.attach(contracts.contractManager.address);
  const minters = [
    contracts.exchange.address,
    contracts.mysterybox.address,
    contracts.staking.address,
    contracts.claimProxy.address,
  ];
  const metadata = [contracts.contractManager.address];
  const tx = await cM.setFactories(
    // minters
    minters,
    // metadata editors
    metadata,
  );
  console.info("Factories set, tx:", tx.hash);
}

async function grantRoles() {
  await setFactories();
  await blockAwait();
  // MODULE:mysterybox-market
  const tx1 = await contracts.mysterybox.grantRole(MINTER_ROLE, contracts.staking.address);
  console.info(`MINTER_ROLE granted for staking in LBX:`, tx1.hash);
  const tx2 = await contracts.mysterybox.grantRole(MINTER_ROLE, contracts.exchange.address);
  console.info(`MINTER_ROLE granted for exchange in LBX:`, tx2.hash);
  const tx3 = await contracts.mysterybox.grantRole(MINTER_ROLE, contracts.claimProxy.address);
  console.info(`MINTER_ROLE granted for exchange in LBX:`, tx3.hash);
}

async function main() {
  await deploySystem();
  await deployModules();
  await setFactories();
  await grantRoles();
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

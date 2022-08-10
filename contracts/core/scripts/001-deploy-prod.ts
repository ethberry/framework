import { ethers } from "hardhat";
import { Contract } from "ethers";

import { baseTokenURI, MINTER_ROLE } from "../test/constants";
import { wallet } from "@gemunion/constants";
import { ContractManager } from "../typechain-types";
import { blockAwait } from "./utils/blockAwait";

const contracts: Record<string, Contract> = {};

const delay = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

async function deploySystem() {
  const vestFactory = await ethers.getContractFactory("ContractManager");
  contracts.contractManager = await vestFactory.deploy();
  await delay(15000).then(() => console.info("delay 5000 done"));

  const exchangeFactory = await ethers.getContractFactory("Exchange");
  contracts.exchange = await exchangeFactory.deploy("Exchange");
  await delay(15000).then(() => console.info("delay 5000 done"));
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
  await delay(15000).then(() => console.info("delay 5000 done"));
  const lootboxFactory = await ethers.getContractFactory("ERC721Lootbox");
  contracts.lootbox = await lootboxFactory.deploy("Lootbox", "LOOT", 100, baseTokenURI);
  await delay(15000).then(() => console.info("delay 5000 done"));
}

async function deployModules() {
  // await deployVesting();
  await deployLootbox();
  await delay(15000).then(() => console.info("delay 5000 done"));

  // MODULE:CLAIM
  const claimFactory = await ethers.getContractFactory("ClaimProxy");
  contracts.claimProxy = await claimFactory.deploy();
  await delay(15000).then(() => console.info("delay 5000 done"));
  // MODULE:STAKING
  const stakingFactory = await ethers.getContractFactory("Staking");
  contracts.staking = await stakingFactory.deploy(10);
  await delay(15000).then(() => console.info("delay 5000 done"));
}

async function setFactories() {
  await deployModules();
  await delay(15000).then(() => console.info("delay 5000 done"));
  // MODULE:CM
  const vestFactory = await ethers.getContractFactory("ContractManager");
  const cM: ContractManager = vestFactory.attach(contracts.contractManager.address);
  const minters = [
    contracts.exchange.address,
    contracts.lootbox.address,
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
  await delay(15000).then(() => console.info("delay 5000 done"));
  // MODULE:lootbox-market
  const tx1 = await contracts.lootbox.grantRole(MINTER_ROLE, contracts.staking.address);
  console.info(`MINTER_ROLE granted for staking in LBX:`, tx1.hash);
  await delay(15000).then(() => console.info("delay 5000 done"));
  const tx2 = await contracts.lootbox.grantRole(MINTER_ROLE, contracts.exchange.address);
  console.info(`MINTER_ROLE granted for exchange in LBX:`, tx2.hash);
  await delay(15000).then(() => console.info("delay 5000 done"));
  const tx3 = await contracts.lootbox.grantRole(MINTER_ROLE, contracts.claimProxy.address);
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

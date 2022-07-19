import { ethers } from "hardhat";
import { baseTokenURI } from "../test/constants";

async function deploySystem() {
  const vestFactory = await ethers.getContractFactory("ContractManager");
  const vestInstance = await vestFactory.deploy();
  console.info(`CONTRACT_MANAGER_ADDR=${vestInstance.address.toLowerCase()}`);

  const exchangeFactory = await ethers.getContractFactory("Exchange");
  const exchangeInstance = await exchangeFactory.deploy("Exchange");
  console.info(`EXCHANGE_ADDR=${exchangeInstance.address.toLowerCase()}`);
}

async function deployModules() {
  // MODULE:LOOTBOX
  const dropFactory = await ethers.getContractFactory("ERC721Lootbox");
  const dropInstance = await dropFactory.deploy("Lootbox", "LOOT", 100, baseTokenURI);
  console.info(`LOOTBOX_ADDR=${dropInstance.address.toLowerCase()}`);

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
  await deployModules();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

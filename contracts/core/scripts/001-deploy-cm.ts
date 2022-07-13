import { ethers } from "hardhat";

async function main() {
  // CONTRACT MANAGER
  const vestFactory = await ethers.getContractFactory("ContractManager");
  const vestInstance = await vestFactory.deploy();
  console.info(`CONTRACT_MANAGER_ADDR=${vestInstance.address.toLowerCase()}`);

  // Exchange
  const exchangeFactory = await ethers.getContractFactory("Exchange");
  const exchangeInstance = await exchangeFactory.deploy("Exchange");
  console.info(`EXCHANGE_ADDR=${exchangeInstance.address.toLowerCase()}`);

  // Dropbox
  const dropFactory = await ethers.getContractFactory("Dropbox");
  const dropInstance = await dropFactory.deploy("Dropbox", "DBX", 100, "https://fw-json-api.gemunion.io/");
  console.info(`DROPBOX_ADDR=${dropInstance.address.toLowerCase()}`);

  // Airdrop contract
  const airdropFactory = await ethers.getContractFactory("Airdrop");
  const airdropInstance = await airdropFactory.deploy(
    "Airdrop",
    "AIRDROP",
    10000,
    100,
    "https://fw-json-api.gemunion.io/",
  );
  console.info(`AIRDROP_ADDR=${airdropInstance.address.toLowerCase()}`);

  // Uni Mechanics contract
  const stakingFactory = await ethers.getContractFactory("Staking");
  const stakingInstance = await stakingFactory.deploy(10);
  console.info(`STAKING_ADDR=${stakingInstance.address.toLowerCase()}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

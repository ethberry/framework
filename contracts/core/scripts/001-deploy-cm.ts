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

  // Lootbox
  const dropFactory = await ethers.getContractFactory("Lootbox");
  const dropInstance = await dropFactory.deploy("Lootbox", "DBX", 100, "https://fw-json-api.gemunion.io/");
  console.info(`LOOTBOX_ADDR=${dropInstance.address.toLowerCase()}`);

  // Claim contract
  const claimFactory = await ethers.getContractFactory("ClaimProxy");
  const claimInstance = await claimFactory.deploy();
  console.info(`CLAIM_PROXY_ADDR=${claimInstance.address.toLowerCase()}`);

  // Uni Mechanics contract
  const stakingFactory = await ethers.getContractFactory("Staking");
  const stakingInstance = await stakingFactory.deploy(10);
  console.info(`STAKING_ADDR=${stakingInstance.address.toLowerCase()}`);

  // Uni Mechanics contract
  const metaFactory = await ethers.getContractFactory("MetaDataManipulator");
  const metaInstance = await metaFactory.deploy("MetaDataManipulator");
  console.info(`METADATA_ADDR=${metaInstance.address.toLowerCase()}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

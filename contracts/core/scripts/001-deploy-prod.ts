import { ethers } from "hardhat";
import { Contract } from "ethers";

import { MINTER_ROLE } from "../test/constants";
import { ContractManager } from "../typechain-types";
import { blockAwait } from "./utils/blockAwait";
import { deployStaking } from "./deploy/mechanics/staking";
import { deployClaim } from "./deploy/mechanics/claim";
import { deployMysterybox } from "./deploy/mechanics/mysterybox";
import { deployVesting } from "./deploy/mechanics/vesting";
import { deploySystem } from "./deploy/system";

const contracts: Record<string, Contract> = {};

async function deployMechanics(contracts: Record<string, Contract>) {
  await deployVesting(contracts);
  await deployMysterybox(contracts);
  await deployStaking(contracts);
  await deployClaim(contracts);
}

async function setFactories() {
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
  await deploySystem(contracts);
  await deployMechanics(contracts);
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

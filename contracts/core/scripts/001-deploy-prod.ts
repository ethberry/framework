import { Contract } from "ethers";

import { deployStaking } from "./deploy/mechanics/staking";
import { deployClaim } from "./deploy/mechanics/claim";
import { deploySystem } from "./deploy/system";
import { deployLottery } from "./deploy/mechanics/lottery";

const contracts: Record<string, Contract> = {};

async function deployMechanics(contracts: Record<string, Contract>) {
  await deployClaim(contracts);
  await deployStaking(contracts);
  await deployLottery(contracts);
}

async function main() {
  await deploySystem(contracts);
  await deployMechanics(contracts);
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

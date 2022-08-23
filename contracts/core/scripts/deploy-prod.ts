import { Contract } from "ethers";

import { deployStaking } from "./deploy/mechanics/staking";
import { deploySystem } from "./deploy/system";
import { deployLotteryProd } from "./deploy/mechanics/lottery_prod";

const contracts: Record<string, Contract> = {};

async function deployMechanics(contracts: Record<string, Contract>) {
  await deployStaking(contracts);
  await deployLotteryProd(contracts);
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

import { camelToSnakeCase } from "@gemunion/contracts-utils";

import { deployLotteryProd } from "./deploy/mechanics/lottery_prod";
import { deployWaitlist } from "./deploy/mechanics/waitlist";
import { deployWrapper } from "./deploy/mechanics/wrapper";
import { deployStakingProd } from "./deploy/mechanics/staking_prod";
import { deploySystem } from "./deploy/system";

const contracts: Record<string, any> = {};

async function deployMechanics(contracts: Record<string, any>) {
  await deployStakingProd(contracts);
  await deployLotteryProd(contracts);
  await deployWaitlist(contracts);
  await deployWrapper(contracts);
}

async function main() {
  await deploySystem(contracts);
  await deployMechanics(contracts);
}

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

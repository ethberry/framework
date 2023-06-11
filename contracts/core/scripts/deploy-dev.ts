import { deploySystem } from "./deploy/system";
import { deployERC20 } from "./deploy/hierarchy/erc20";
import { deployERC721 } from "./deploy/hierarchy/erc721";
import { deployERC998 } from "./deploy/hierarchy/erc998";
import { deployERC1155 } from "./deploy/hierarchy/erc1155";
import { deployVesting } from "./deploy/mechanics/vesting";
import { deployMysterybox } from "./deploy/mechanics/mysterybox";
import { deployStaking } from "./deploy/mechanics/staking";
import { deployChainLink } from "./deploy/integrations/chain-link";
import { deployUsdt } from "./deploy/integrations/usdt";
import { deployLottery } from "./deploy/mechanics/lottery";
import { deployWeth } from "./deploy/integrations/weth";
import { deployBusd } from "./deploy/integrations/busd";

const contracts: Record<string, any> = {};

async function deployHierarchy(contracts: Record<string, any>) {
  await deployERC20(contracts);
  await deployERC721(contracts);
  await deployERC998(contracts);
  await deployERC1155(contracts);
}

async function deployMechanics(contracts: Record<string, any>) {
  await deployVesting(contracts);
  await deployStaking(contracts);
  await deployMysterybox(contracts);
  await deployLottery(contracts);
}

async function deployIntegrations(contracts: Record<string, any>) {
  await deployChainLink(contracts);
  await deployUsdt(contracts);
  await deployWeth(contracts);
  await deployBusd(contracts);
}

async function main() {
  await deploySystem(contracts);
  await deployHierarchy(contracts);
  await deployMechanics(contracts);
  await deployIntegrations(contracts);
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

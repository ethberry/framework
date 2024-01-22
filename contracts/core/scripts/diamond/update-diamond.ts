import { ethers } from "hardhat";
import fs from "fs";
import { camelToSnakeCase } from "@gemunion/contracts-helpers";
import { debug } from "../utils/deploy-utils";
import { addFacetDiamond, deployDiamond, updateFacetDiamond } from "../../test/Exchange/shared";

const currentBlock: { number: number } = { number: 1 };
const contracts: Record<string, any> = {};

async function main() {
  const block = await ethers.provider.getBlock("latest");
  currentBlock.number = block!.number;
  fs.appendFileSync(
    `${process.cwd()}/log.txt`,
    // `${camelToSnakeCase(Object.keys(obj).pop() || "none").toUpperCase()}_ADDR=${contract && contract.address ? contract.address.toLowerCase : "--"}\n`,
    `STARTING_BLOCK=${currentBlock.number}\n`,
  );

  // DIAMOND EXCHANGE DEPLOY (INIT)
  const exchangeInstance = await deployDiamond("DiamondExchange", ["ExchangeClaimFacet1"], "DiamondExchangeInit", {
    log: true,
    logSelectors: true,
  });
  contracts.exchange = exchangeInstance;
  await debug(contracts);

  // BESU DEV
  const exchangeAddr = await exchangeInstance.getAddress();
  // BSC STAGE
  // const exchangeAddr = "0x5fee6631bfa86057c5878ea170564b67774e1fe8";

  // UPDATE DIAMOND EXCHANGE (ADD FACET) !!!
  await addFacetDiamond("DiamondExchange", exchangeAddr, ["DiamondLoupeFacet"], {
    log: true,
    logSelectors: true,
  });

  // UPDATE DIAMOND EXCHANGE (REPLACE FACET)
  await updateFacetDiamond("DiamondExchange", exchangeAddr, ["ExchangeClaimFacet"], {
    log: true,
    logSelectors: true,
  });
}

main()
  .then(async () => {
    console.info(`STARTING_BLOCK=${currentBlock.number}`);
    for (const [key, value] of Object.entries(contracts)) {
      console.info(`${camelToSnakeCase(key).toUpperCase()}_ADDR=${(await value.getAddress()).toLowerCase()}`);
    }
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

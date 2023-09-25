import { ethers } from "hardhat";
import { Contract } from "ethers";
import fs from "fs";
import { blockAwait, blockAwaitMs, camelToSnakeCase } from "@gemunion/contracts-utils";
import { METADATA_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";
import { deployDiamond } from "../test/Exchange/shared/fixture";

const delay = 2; // block delay
const delayMs = 1100; // block delay ms

interface IObj {
  address?: string;
  hash?: string;
}

const debug = async (obj: IObj | Record<string, Contract>, name?: string) => {
  if (obj && obj.hash) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    console.info(`${name} tx: ${obj.hash}`);
    await blockAwaitMs(delayMs);
  } else {
    console.info(`${Object.keys(obj).pop()} deployed`);
    const tx = Object.values(obj).pop();
    const contract = tx;
    await blockAwait(delay, delayMs);
    const address = await contract.getAddress();
    fs.appendFileSync(
      `${process.cwd()}/log.txt`,
      // `${camelToSnakeCase(Object.keys(obj).pop() || "none").toUpperCase()}_ADDR=${contract && contract.address ? contract.address.toLowerCase : "--"}\n`,
      `${camelToSnakeCase(Object.keys(obj).pop() || "none").toUpperCase()}_ADDR=${address.toLowerCase() || "--"}\n`,
    );
  }
};

const contracts: Record<string, any> = {};
const currentBlock: { number: number } = { number: 1 };

async function main() {
  const block = await ethers.provider.getBlock("latest");
  currentBlock.number = block!.number;
  fs.appendFileSync(
    `${process.cwd()}/log.txt`,
    // `${camelToSnakeCase(Object.keys(obj).pop() || "none").toUpperCase()}_ADDR=${contract && contract.address ? contract.address.toLowerCase : "--"}\n`,
    `STARTING_BLOCK=${currentBlock.number}\n`,
  );

  // LINK & VRF
  // HAVE TO PASS VRF AND LINK ADDRESSES TO CHAINLINK-BESU CONCTRACT

  // DIAMOND CM
  const cmInstance = await deployDiamond(
    "DiamondCM",
    [
      "CollectionFactoryFacet",
      "ERC20FactoryFacet",
      "ERC721FactoryFacet",
      "ERC998FactoryFacet",
      "ERC1155FactoryFacet",
      "LotteryFactoryFacet",
      "MysteryBoxFactoryFacet",
      "PonziFactoryFacet",
      "RaffleFactoryFacet",
      "StakingFactoryFacet",
      "VestingFactoryFacet",
      "WaitListFactoryFacet",
      "UseFactoryFacet",
      "AccessControlFacet",
      "PausableFacet",
    ],
    "DiamondCMInit",
    {
      log: true,
      logSelectors: false,
    },
  );
  contracts.contractManager = cmInstance;
  await debug(contracts);

  const factoryInstance = await ethers.getContractAt("UseFactoryFacet", await contracts.contractManager.getAddress());
  // const factoryInstance = await ethers.getContractAt("UseFactoryFacet", "0x7794f02dd366e28c0e1d8e6231fa5caf15e9b3b6");

  // DIAMOND EXCHANGE
  const exchangeInstance = await deployDiamond(
    "DiamondExchange",
    [
      "ExchangePurchaseFacet",
      "ExchangeClaimFacet",
      "ExchangeBreedFacet",
      "ExchangeCraftFacet",
      "ExchangeDismantleFacet",
      "ExchangeGradeFacet",
      "ExchangeLotteryFacet",
      "ExchangeRaffleFacet",
      "ExchangeMysteryBoxFacet",
      "ExchangeRentableFacet",
      "PausableFacet",
      "AccessControlFacet",
      "WalletFacet",
    ],
    "DiamondExchangeInit",
    {
      log: false,
      logSelectors: false,
    },
  );
  contracts.exchange = exchangeInstance;
  await debug(contracts);

  const exchangeAddress = await exchangeInstance.getAddress();

  await debug(await factoryInstance.addFactory(exchangeAddress, MINTER_ROLE), "contractManager.addFactory");

  await debug(await factoryInstance.addFactory(exchangeAddress, METADATA_ROLE), "contractManager.addFactory");

  const dispenserFactory = await ethers.getContractFactory("Dispenser");
  contracts.dispenser = await dispenserFactory.deploy();
  await debug(contracts);
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

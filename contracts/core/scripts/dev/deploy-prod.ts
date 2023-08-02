import { ethers } from "hardhat";
import { Contract } from "ethers";
import fs from "fs";
import { blockAwait, blockAwaitMs, camelToSnakeCase } from "@gemunion/contracts-utils";
import { METADATA_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";
import { deployDiamond } from "../../test/DiamondExchange/shared/fixture";

const delay = 1; // block delay
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
  // const vrfAddr =
  //   network.name === "besu"
  //     ? "0xa50a51c09a5c451C52BB714527E1974b686D8e77" // vrf besu localhost
  //     : network.name === "gemunion"
  //     ? "0x86c86939c631d53c6d812625bd6ccd5bf5beb774" // vrf besu gemunion
  //     : "0xa50a51c09a5c451C52BB714527E1974b686D8e77";
  // const vrfInstance = await ethers.getContractAt("VRFCoordinatorMock", vrfAddr);

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
      "PyramidFactoryFacet",
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
      log: false,
      logSelectors: false,
    },
  );
  contracts.contractManager = cmInstance;
  await debug(contracts);
  const factoryInstance = await ethers.getContractAt("UseFactoryFacet", await contracts.contractManager.getAddress());

  // console.info("contracts.contractManager.address", contracts.contractManager.address);

  // DIAMOND EXCHANGE
  const exchangeInstance = await deployDiamond(
    "DiamondExchange",
    [
      "ExchangePurchaseFacet",
      "ExchangeClaimFacet",
      "ExchangeBreedFacet",
      "ExchangeCraftFacet",
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

  await debug(
    await factoryInstance.addFactory(await exchangeInstance.getAddress(), MINTER_ROLE),
    "contractManager.addFactory",
  );

  await debug(
    await factoryInstance.addFactory(await exchangeInstance.getAddress(), METADATA_ROLE),
    "contractManager.addFactory",
  );

  const dispenserFactory = await ethers.getContractFactory("Dispenser");
  contracts.dispenser = await dispenserFactory.deploy();
  await debug(contracts);

  // GRANT ROLES
  // await grantRoles(
  //   [
  //     await contracts.erc1155Blacklist.getAddress(),
  //     await contracts.erc1155New.getAddress(),
  //     await contracts.erc1155Simple.getAddress(),
  //     await contracts.erc721New.getAddress(),
  //     await contracts.erc721Random.getAddress(),
  //     await contracts.erc721Simple.getAddress(),
  //     await contracts.erc721Blacklist.getAddress(),
  //     await contracts.erc721Discrete.getAddress(),
  //     await contracts.erc721Rentable.getAddress(),
  //     await contracts.erc721Soulbound.getAddress(),
  //     await contracts.erc721Genes.getAddress(),
  //     await contracts.erc721Generative.getAddress(),
  //     await contracts.erc998Blacklist.getAddress(),
  //     await contracts.erc998New.getAddress(),
  //     await contracts.erc998Random.getAddress(),
  //     await contracts.erc998Simple.getAddress(),
  //     await contracts.erc998Discrete.getAddress(),
  //     await contracts.erc998Genes.getAddress(),
  //     await contracts.erc998Rentable.getAddress(),
  //     await contracts.erc998OwnerErc1155Erc20.getAddress(),
  //     await contracts.erc998OwnerErc1155.getAddress(),
  //     await contracts.erc998OwnerErc20.getAddress(),
  //     await contracts.erc721MysteryboxBlacklistPausable.getAddress(),
  //     await contracts.erc721MysteryboxBlacklist.getAddress(),
  //     await contracts.erc721MysteryboxPausable.getAddress(),
  //     await contracts.erc721MysteryboxSimple.getAddress(),
  //     await contracts.erc721LotteryTicket.getAddress(),
  //     await contracts.erc721RaffleTicket.getAddress(),
  //     await contracts.lottery.getAddress(),
  //     await contracts.raffle.getAddress(),
  //   ],
  //   [
  //     await contracts.erc721Wrapper.getAddress(),
  //     await contracts.exchange.getAddress(),
  //     await contracts.staking.getAddress(),
  //     await contracts.waitlist.getAddress(),
  //     await contracts.erc721MysteryboxBlacklist.getAddress(),
  //     await contracts.erc721MysteryboxPausable.getAddress(),
  //     await contracts.erc721MysteryboxSimple.getAddress(),
  //     await contracts.lottery.getAddress(),
  //     await contracts.raffle.getAddress(),
  //     await contracts.pyramid.getAddress(),
  //   ],
  //   [MINTER_ROLE],
  // );
  // GRANT METADATA ROLES
  // await grantRoles(
  //   [
  //     await contracts.erc721Random.getAddress(),
  //     await contracts.erc721Discrete.getAddress(),
  //     await contracts.erc998Discrete.getAddress(),
  //   ],
  //   [await contracts.exchange.getAddress()],
  //   [METADATA_ROLE],
  // );
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

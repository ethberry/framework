import { ethers, network } from "hardhat";
import { BigNumber, constants, Contract, utils } from "ethers";

import { blockAwait, blockAwaitMs } from "@gemunion/contracts-utils";
import { TransactionReceipt, TransactionResponse } from "@ethersproject/abstract-provider";

const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter}`);
const delay = 3; // block delay
const delayMs = 1500; // block delay ms

interface IObj {
  address?: string;
  hash?: string;
  wait: () => Promise<TransactionReceipt> | void;
}

const debug = async (obj: IObj | Record<string, Contract> | TransactionResponse, name?: string) => {
  if (obj && obj.hash) {
    console.info(`${name} tx: ${obj.hash}`);
    await blockAwaitMs(delayMs);
    const transaction: TransactionResponse = obj as TransactionResponse;
    await transaction.wait();
  } else {
    console.info(`${Object.keys(obj).pop()} deployed`);
    await blockAwait(delay, delayMs);
  }
};

const contracts: Record<string, Contract> = {};

async function main() {
  // LINK & VRF
  const linkAddr =
    network.name === "besu"
      ? "0x42699A7612A82f1d9C36148af9C77354759b210b"
      : network.name === "gemunion"
      ? "0x1fa66727cDD4e3e4a6debE4adF84985873F6cd8a"
      : "0x42699A7612A82f1d9C36148af9C77354759b210b";

  const vrfAddr =
    network.name === "besu"
      ? "0xa50a51c09a5c451C52BB714527E1974b686D8e77" // vrf besu localhost
      : network.name === "gemunion"
      ? "0x86c86939c631d53c6d812625bd6ccd5bf5beb774" // vrf besu gemunion
      : "0xa50a51c09a5c451C52BB714527E1974b686D8e77";

  const linkFactory = await ethers.getContractFactory("LinkToken");
  // const linkInstance = linkFactory.attach(linkAddr);
  const linkInstance = await linkFactory.deploy();
  contracts.link = linkInstance;
  await debug(contracts);
  // console.info(`LINK_ADDR=${contracts.link.address}`);
  const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
  const vrfInstance = await vrfFactory.deploy(contracts.link.address);
  // const vrfInstance = vrfFactory.attach(vrfAddr);
  contracts.vrf = vrfInstance;
  await debug(contracts);
  // console.info(`VRF_ADDR=${contracts.vrf.address}`);

  if (contracts.link.address !== linkAddr) {
    console.info("LINK_ADDR address mismatch, clean BESU, then try again");
  }
  if (contracts.vrf.address !== vrfAddr) {
    console.info("VRF_ADDR address mismatch, clean BESU, then try again");
  }
  // BESU gemunion
  // address(0x86C86939c631D53c6D812625bD6Ccd5Bf5BEb774), // vrfCoordinator
  //   address(0x1fa66727cDD4e3e4a6debE4adF84985873F6cd8a), // LINK token
  // SETUP CHAIN_LINK VRF-V2 TO WORK
  const linkAmount = constants.WeiPerEther.mul(10);

  await debug(await vrfInstance.setConfig(3, 1000000, 1, 1, 1), "setConfig");

  await debug(await vrfInstance.createSubscription(), "createSubscription");
  // TODO get subId from createSubscription event
  const subId = utils.hexZeroPad(ethers.utils.hexlify(BigNumber.from(1)), 32);
  await debug(await linkInstance.transferAndCall(vrfInstance.address, linkAmount, subId), "transferAndCall");
  // const linkInstance = link.attach("0xa50a51c09a5c451C52BB714527E1974b686D8e77"); // localhost BESU
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

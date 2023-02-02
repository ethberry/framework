import { ethers } from "hardhat";
import { Contract } from "ethers";

import { blockAwait, blockAwaitMs } from "@gemunion/contracts-utils";
import { TransactionReceipt, TransactionResponse } from "@ethersproject/abstract-provider";

const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter}`);
const delay = 2; // block delay
const delayMs = 1000; // block delay ms

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
  const linkFactory = await ethers.getContractFactory("LinkToken");
  // const linkInstance = linkFactory.attach("0x18C8044BEaf97a626E2130Fe324245b96F81A31F");
  const linkInstance = await linkFactory.deploy();
  contracts.link = linkInstance;
  await debug(contracts);
  // console.info(`LINK_ADDR=${contracts.link.address}`);
  const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
  contracts.vrf = await vrfFactory.deploy(contracts.link.address);
  await debug(contracts);
  // console.info(`VRF_ADDR=${contracts.vrf.address}`);

  if (contracts.link.address !== "0x42699A7612A82f1d9C36148af9C77354759b210b") {
    console.info("LINK_ADDR address mismatch, clean BESU, then try again");
  }
  if (contracts.vrf.address !== "0xa50a51c09a5c451C52BB714527E1974b686D8e77") {
    console.info("VRF_ADDR address mismatch, clean BESU, then try again");
  }
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

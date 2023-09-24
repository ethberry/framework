import { ethers, network } from "hardhat";
import { Contract, Result, toBeHex, TransactionReceipt, TransactionResponse, WeiPerEther, zeroPadValue } from "ethers";

import { blockAwait, blockAwaitMs, camelToSnakeCase } from "@gemunion/contracts-utils";

const delay = 2; // block delay
const delayMs = 1000; // block delay ms
// const subscriptionId = 1; // besu
// const subscriptionId = 2; // gemunion

interface IObj {
  address?: string;
  hash?: string;
  wait: () => Promise<TransactionReceipt> | void;
}

const recursivelyDecodeResult = (result: Result): Record<string, any> => {
  if (typeof result !== "object") {
    // Raw primitive value
    return result;
  }
  try {
    const obj = result.toObject();
    if (obj._) {
      throw new Error("Decode as array, not object");
    }
    Object.keys(obj).forEach(key => {
      obj[key] = recursivelyDecodeResult(obj[key]);
    });
    return obj;
  } catch (err) {
    // Result is array.
    return result.toArray().map(item => recursivelyDecodeResult(item as Result));
  }
};

const debug = async (obj: IObj | Record<string, Contract> | TransactionResponse, name?: string) => {
  if (obj && obj.hash) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    console.info(`${name} tx: ${obj.hash}`);
    await blockAwaitMs(delayMs);
    const transaction: TransactionResponse = obj as TransactionResponse;
    await transaction.wait();
  } else {
    console.info(`${Object.keys(obj).pop()} deployed`);
    await blockAwait(delay, delayMs);
  }
};

const contracts: Record<string, any> = {};

async function main() {
  const [_owner, receiver, _stranger] = await ethers.getSigners();
  const block = await ethers.provider.getBlock("latest");

  // LINK & VRF
  const linkAddr =
    network.name === "besu"
      ? "0x42699A7612A82f1d9C36148af9C77354759b210b"
      : network.name === "gemunion" || network.name === "gemunionprod"
      ? "0x1fa66727cDD4e3e4a6debE4adF84985873F6cd8a"
      : "0x42699A7612A82f1d9C36148af9C77354759b210b";

  const vrfAddr =
    network.name === "besu"
      ? "0xa50a51c09a5c451C52BB714527E1974b686D8e77" // vrf besu localhost
      : network.name === "gemunion" || network.name === "gemunionprod"
      ? "0x86c86939c631d53c6d812625bd6ccd5bf5beb774" // vrf besu gemunion
      : "0xa50a51c09a5c451C52BB714527E1974b686D8e77";

  const linkInstance = await ethers.getContractAt("LinkToken", linkAddr);
  const vrfInstance = await ethers.getContractAt("VRFCoordinatorMock", vrfAddr);

  const linkAmount = WeiPerEther * 100n;

  console.info("_owner.address", _owner.address);

  await debug(await vrfInstance.createSubscription(), "createSubscription");
  // await blockAwaitMs(5000);
  // emit SubscriptionCreated(currentSubId, msg.sender);
  const eventFilter = vrfInstance.filters.SubscriptionCreated();
  const events = await vrfInstance.queryFilter(eventFilter, block!.number);
  const { subId } = recursivelyDecodeResult(events[events.length - 1].args as unknown as Result);
  console.info("SubscriptionCreated", subId);

  const subscriptionId = zeroPadValue(toBeHex(subId), 32);

  // await debug(await linkInstance.connect(receiver).transfer(_owner.address, linkAmount), "transfer to owner");

  await debug(
    await linkInstance.transferAndCall(await vrfInstance.getAddress(), linkAmount, subscriptionId),
    "transferAndCall",
  );

  const subs = await vrfInstance.getSubscription(subId);
  console.info("Subscription", recursivelyDecodeResult(subs as unknown as Result));
  // const linkInstance = link.attach("0xa50a51c09a5c451C52BB714527E1974b686D8e77"); // localhost BESU
  // const eventFilter1 = vrfInstance.filters.SubscriptionFunded();
  // const events1 = await vrfInstance.queryFilter(eventFilter1);
  // const { newBalance } = recursivelyDecodeResult(events1[events1.length - 1].args as unknown as Result);
  // console.info("SubscriptionFunded", newBalance);
}

main()
  .then(async () => {
    for (const [key, value] of Object.entries(contracts)) {
      console.info(`${camelToSnakeCase(key).toUpperCase()}_ADDR=${(await value.getAddress()).toLowerCase()}`);
    }
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

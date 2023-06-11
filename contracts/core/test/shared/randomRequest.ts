import { ethers } from "hardhat";
import { hexlify, randomBytes } from "ethers";

import { VRFCoordinatorMock } from "../../typechain-types";

export async function randomRequest(rndInstance: any, vrfInstance: VRFCoordinatorMock) {
  const eventFilter = vrfInstance.filters.RandomWordsRequested();
  const events = await vrfInstance.queryFilter(eventFilter);
  for (const e of events) {
    const {
      args: { keyHash, requestId, subId, callbackGasLimit, numWords, sender },
    } = e;

    const blockNum = await ethers.provider.getBlockNumber();

    await vrfInstance.fulfillRandomWords(requestId, keyHash, hexlify(randomBytes(32)), {
      blockNum,
      subId,
      callbackGasLimit,
      numWords,
      sender,
    });
  }
}

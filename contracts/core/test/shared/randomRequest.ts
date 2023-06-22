import { ethers } from "hardhat";
import { toBeHex } from "ethers";

import { VRFCoordinatorMock } from "../../typechain-types";

export async function randomRequest(rndInstance: any, vrfInstance: VRFCoordinatorMock) {
  const eventFilter = vrfInstance.filters.RandomWordsRequested();
  const events = await vrfInstance.queryFilter(eventFilter);
  for (const e of events) {
    const {
      args: { keyHash, requestId, subId, callbackGasLimit, numWords, sender },
    } = e;

    const blockNum = await ethers.provider.getBlockNumber();
    // ATTENTION: 32 is not random, fixed number is needed to test RARITY
    await vrfInstance.fulfillRandomWords(requestId, keyHash, toBeHex(32), {
      blockNum,
      subId,
      callbackGasLimit,
      numWords,
      sender,
    });
  }
}

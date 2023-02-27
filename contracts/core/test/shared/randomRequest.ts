import { Contract, utils } from "ethers";
import { ethers } from "hardhat";

import { VRFCoordinatorMock } from "../../typechain-types";

// this works not only on ERC721 but also on Lottery
export async function randomRequest(rndInstance: Contract, vrfInstance: VRFCoordinatorMock) {
  const eventFilter = vrfInstance.filters.RandomnessRequestId();
  const events = await vrfInstance.queryFilter(eventFilter);
  for (const e of events) {
    await vrfInstance.callBackWithRandomness(e.args[0], utils.randomBytes(32), rndInstance.address);
  }
}

export async function randomRequestV2(rndInstance: Contract, vrfInstance: VRFCoordinatorMock) {
  const eventFilter = vrfInstance.filters.RandomWordsRequested();
  const events = await vrfInstance.queryFilter(eventFilter);

  for (const e of events) {
    const {
      args: { keyHash, requestId, subId, callbackGasLimit, numWords, sender },
    } = e;

    await vrfInstance.fulfillRandomWords(requestId, keyHash, ethers.BigNumber.from(256), {
      blockNum: await ethers.provider.getBlockNumber(),
      subId,
      callbackGasLimit,
      numWords,
      sender,
    });
  }
}

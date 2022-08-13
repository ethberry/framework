import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import { LotteryRandomTestHardhat, VRFCoordinatorMock } from "../../../typechain-types";

export async function randomRequest(rndInstance: LotteryRandomTestHardhat, vrfInstance: VRFCoordinatorMock) {
  const eventFilter = rndInstance.filters.RandomRequest();
  const events = await rndInstance.queryFilter(eventFilter);
  if (events && events.length) {
    events.map(async (event, indx) => {
      if (events[indx].args) {
        await vrfInstance.callBackWithRandomness(
          events[indx].args[0],
          BigNumber.from(ethers.utils.randomBytes(32)),
          rndInstance.address,
        );
      }
    });
  }
}

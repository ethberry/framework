import { Contract, utils } from "ethers";

import { VRFCoordinatorMock } from "../../typechain-types";

// this works not only on ERC721 but also on Lottery
export async function randomRequest(rndInstance: Contract, vrfInstance: VRFCoordinatorMock) {
  const eventFilter = vrfInstance.filters.RandomnessRequestId();
  const events = await vrfInstance.queryFilter(eventFilter);
  return vrfInstance.callBackWithRandomness(
    events[events.length - 1].args[0],
    utils.randomBytes(32),
    rndInstance.address,
  );
}

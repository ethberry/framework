import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";

import { ERC721RandomHardhat, VRFCoordinatorMock } from "../../../../typechain-types";

export async function randomRequest(
  rndInstance: ERC721RandomHardhat,
  vrfInstance: VRFCoordinatorMock,
  finalBalance: number,
) {
  const eventFilter = rndInstance.filters.RandomRequest();
  const events = await rndInstance.queryFilter(eventFilter);
  let requestId: string;
  const [owner] = await ethers.getSigners();
  if (events && events.length) {
    events.map(async (event, indx) => {
      if (events[indx].args) {
        requestId = events[indx]!.args[0]!;
        expect(requestId);
        const txrnd = vrfInstance.callBackWithRandomness(
          requestId,
          BigNumber.from(ethers.utils.randomBytes(32)),
          rndInstance.address,
        );
        await expect(txrnd).to.emit(rndInstance, "Transfer");
        await expect(txrnd).to.emit(rndInstance, "MintRandom");
        const balance = await rndInstance.balanceOf(owner.address);
        expect(balance).to.equal(finalBalance + indx);
      }
    });
  }
}

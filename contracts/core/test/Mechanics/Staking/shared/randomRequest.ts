import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";

import { ERC721RandomHardhat, VRFCoordinatorMock } from "../../../../typechain-types";

export async function randomRequest(
  rndInstance: ERC721RandomHardhat,
  vrfInstance: VRFCoordinatorMock,
  finalBalance: number,
  account: string,
) {
  const eventFilter = rndInstance.filters.RandomRequest();
  const events = await rndInstance.queryFilter(eventFilter);
  let requestId: string;
  const oldBalance = await rndInstance.balanceOf(account);
  if (events && events.length) {
    events.map(async (event, indx) => {
      if (events[indx].args) {
        requestId = events[indx]!.args[0]!;
        expect(requestId);
        const txrnd = await vrfInstance.callBackWithRandomness(
          requestId,
          BigNumber.from(ethers.utils.randomBytes(32)),
          rndInstance.address,
        );
        await expect(txrnd).to.emit(rndInstance, "Transfer");
      }
    });
    const balance = await rndInstance.balanceOf(account);
    expect(balance.sub(oldBalance)).to.equal(finalBalance);
  }
}

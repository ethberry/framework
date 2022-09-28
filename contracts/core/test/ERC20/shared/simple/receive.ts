import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

import { deployErc20Base } from "../fixtures";

export function shouldReceive(name: string) {
  describe("cap", function () {
    it("should fail: no reason", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      const tx = owner.sendTransaction({
        to: contractInstance.address,
        value: constants.WeiPerEther,
        gasLimit: 21000 + 61, // + revert
      });

      await expect(tx).to.be.reverted;
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

export function shouldRevertETH(factory: () => Promise<Contract>) {
  describe("fund ETH", function () {
    it("should fail: without reason", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = owner.sendTransaction({
        to: contractInstance.address,
        value: 1,
      });
      await expect(tx).to.be.revertedWithoutReason();
    });
  });
}

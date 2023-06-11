import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldMintCommon(factory: () => Promise<any>) {
  describe("mintCommon", function () {
    it("should fail: TemplateZero", async function () {
      const contractInstance = await factory();
      const [owner] = await ethers.getSigners();

      const tx = contractInstance.mintCommon(owner.address, 0);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, `TemplateZero`);
    });
  });
}

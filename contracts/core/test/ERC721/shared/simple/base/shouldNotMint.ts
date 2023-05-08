import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

export function shouldNotMint(factory: () => Promise<Contract>) {
  describe("mint", function () {
    it("should fail: MethodNotSupported", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const tx = contractInstance.mint(receiver.address);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "MethodNotSupported");
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { tokenId } from "../../../../constants";

export function shouldSafeMint(factory: () => Promise<Contract>) {
  describe("safeMint", function () {
    it("should fail: MethodNotSupported", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const tx = contractInstance.safeMint(receiver.address, tokenId);
      await expect(tx).to.be.revertedWith("MethodNotSupported");
    });
  });
}

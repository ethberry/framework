import { ethers } from "hardhat";
import { expect } from "chai";

import { deployErc721Fixture } from "./fixture";

export function shouldMint(name: string) {
  describe("mint", function () {
    it("should fail: MethodNotSupported", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);
      const tx = contractInstance.connect(receiver).mint(receiver.address);
      await expect(tx).to.be.revertedWith("MethodNotSupported");
    });
  });
}

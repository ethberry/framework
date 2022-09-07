import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../constants";
import { deployErc20Fixture } from "./fixture";

export function shouldCap(name: string) {
  describe("cap", function () {
    it("should fail: cap exceeded", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Fixture(name);

      const tx = contractInstance.mint(owner.address, amount + 1);
      await expect(tx).to.be.revertedWith("ERC20Capped: cap exceeded");
    });
  });
}

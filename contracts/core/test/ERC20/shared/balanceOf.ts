import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../constants";

export function shouldBalanceOf(burnable = false) {
  describe("balanceOf", function () {
    it("should get balance of owner", async function () {
      await this.contractInstance.mint(this.owner.address, amount);

      const balance = await this.contractInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(amount);
    });

    it("should get balance of not owner", async function () {
      const balance = await this.contractInstance.balanceOf(this.receiver.address);
      expect(balance).to.equal(0);
    });

    it("should not fail for zero addr", async function () {
      await this.contractInstance.mint(this.owner.address, amount);

      if (burnable) {
        const tx = this.contractInstance.burn(amount);
        await expect(tx)
          .to.emit(this.contractInstance, "Transfer")
          .withArgs(this.owner.address, ethers.constants.AddressZero, amount);
      }

      const balance = await this.contractInstance.balanceOf(ethers.constants.AddressZero);
      expect(balance).to.equal(0);
    });
  });
}

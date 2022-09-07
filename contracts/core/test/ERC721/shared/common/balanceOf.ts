import { expect } from "chai";
import { ethers } from "hardhat";

import { templateId } from "../../../constants";

export function shouldGetBalanceOf() {
  describe("balanceOf", function () {
    it("should fail for zero addr", async function () {
      const tx = this.contractInstance.balanceOf(ethers.constants.AddressZero);
      await expect(tx).to.be.revertedWith(`ERC721: address zero is not a valid owner`);
    });

    it("should get balance of owner", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      const balance = await this.contractInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should get balance of not owner", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      const balance = await this.contractInstance.balanceOf(this.receiver.address);
      expect(balance).to.equal(0);
    });
  });
}

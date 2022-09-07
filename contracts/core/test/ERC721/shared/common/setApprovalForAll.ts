import { expect } from "chai";
import { ethers } from "hardhat";
import { templateId, tokenId } from "../../../constants";

export function shouldSetApprovalForAll() {
  describe("setApprovalForAll", function () {
    it("should approve for all", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      await this.contractInstance.mintCommon(this.owner.address, templateId);

      const balanceOfOwner = await this.contractInstance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(2);

      const tx1 = this.contractInstance.setApprovalForAll(this.receiver.address, true);
      await expect(tx1).to.not.be.reverted;

      const approved1 = await this.contractInstance.getApproved(tokenId);
      expect(approved1).to.equal(ethers.constants.AddressZero);

      const isApproved1 = await this.contractInstance.isApprovedForAll(this.owner.address, this.receiver.address);
      expect(isApproved1).to.equal(true);

      const tx2 = this.contractInstance.setApprovalForAll(this.receiver.address, false);
      await expect(tx2).to.not.be.reverted;

      const approved3 = await this.contractInstance.getApproved(tokenId);
      expect(approved3).to.equal(ethers.constants.AddressZero);

      const isApproved2 = await this.contractInstance.isApprovedForAll(this.owner.address, this.receiver.address);
      expect(isApproved2).to.equal(false);
    });
  });
}

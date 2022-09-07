import { expect } from "chai";
import { ethers } from "hardhat";
import { templateId, tokenId } from "../../../constants";

export function shouldTransferFrom() {
  describe("transferFrom", function () {
    it("should fail: not an owner", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      const tx = this.contractInstance
        .connect(this.receiver)
        .transferFrom(this.owner.address, this.receiver.address, tokenId);

      await expect(tx).to.be.revertedWith(`ERC721: caller is not token owner nor approved`);
    });

    it("should fail: zero addr", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      const tx = this.contractInstance.transferFrom(this.owner.address, ethers.constants.AddressZero, tokenId);

      await expect(tx).to.be.revertedWith(`ERC721: transfer to the zero address`);
    });

    it("should transfer own tokens to wallet", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      const tx = this.contractInstance.transferFrom(this.owner.address, this.receiver.address, tokenId);

      await expect(tx)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, this.receiver.address, tokenId);

      const balanceOfOwner = await this.contractInstance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await this.contractInstance.balanceOf(this.receiver.address);
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer approved tokens to wallet", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      await this.contractInstance.approve(this.receiver.address, tokenId);

      const tx = this.contractInstance
        .connect(this.receiver)
        .transferFrom(this.owner.address, this.receiver.address, tokenId);

      await expect(tx)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, this.receiver.address, tokenId);

      const balanceOfOwner = await this.contractInstance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await this.contractInstance.balanceOf(this.receiver.address);
      expect(balanceOfReceiver).to.equal(1);
    });
  });
}

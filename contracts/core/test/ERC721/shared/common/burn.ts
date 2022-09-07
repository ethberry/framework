import { expect } from "chai";
import { ethers } from "hardhat";
import { templateId, tokenId } from "../../../constants";

export function shouldBurn() {
  describe("burn", function () {
    it("should fail: not an owner", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      const tx = this.contractInstance.connect(this.receiver).burn(tokenId);

      await expect(tx).to.be.revertedWith(`ERC721: caller is not token owner nor approved`);
    });

    it("should burn own token", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      const tx = await this.contractInstance.burn(tokenId);

      await expect(tx)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, tokenId);

      const balanceOfOwner = await this.contractInstance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should burn approved token", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      await this.contractInstance.approve(this.receiver.address, tokenId);

      const tx = await this.contractInstance.burn(tokenId);

      await expect(tx)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, ethers.constants.AddressZero, tokenId);

      const balanceOfOwner = await this.contractInstance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}

import { expect } from "chai";

import { constants } from "ethers";

import { MINTER_ROLE, templateId, tokenId } from "../../constants";

export function shouldMintCommon() {
  describe("mintCommon", function () {
    it("should mint to wallet", async function () {
      const tx = this.erc721Instance.mintCommon(this.receiver.address, templateId);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(constants.AddressZero, this.receiver.address, tokenId);

      const balance = await this.erc721Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(1);
    });

    it("should mint to receiver", async function () {
      const tx = this.erc721Instance.mintCommon(this.erc721ReceiverInstance.address, templateId);
      await expect(tx)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(constants.AddressZero, this.erc721ReceiverInstance.address, tokenId);

      const balance = await this.erc721Instance.balanceOf(this.erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });

    it("should fail: wrong role", async function () {
      const tx = this.erc721Instance.connect(this.receiver).mintCommon(this.receiver.address, templateId);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should fail: to mint to non receiver", async function () {
      const tx = this.erc721Instance.mintCommon(this.erc721NonReceiverInstance.address, templateId);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });
  });
}

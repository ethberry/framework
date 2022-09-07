import { expect } from "chai";
import { templateId, tokenId } from "../../../constants";

export function shouldGetOwnerOf() {
  describe("ownerOf", function () {
    it("should get owner of token", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      const ownerOfToken = await this.contractInstance.ownerOf(tokenId);
      expect(ownerOfToken).to.equal(this.owner.address);
    });

    it("should get owner of burned token", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      const tx = this.contractInstance.burn(tokenId);
      await expect(tx).to.not.be.reverted;

      const balanceOfOwner = await this.contractInstance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);

      const tx2 = this.contractInstance.ownerOf(tokenId);
      await expect(tx2).to.be.revertedWith(`ERC721: invalid token ID`);
    });
  });
}

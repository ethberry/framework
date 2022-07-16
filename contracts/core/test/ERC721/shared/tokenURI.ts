import { expect } from "chai";

import { baseTokenURI, fakeAsset, tokenId } from "../../constants";

export function shouldGetTokenURI() {
  describe("tokenURI", function () {
    it("should get token uri", async function () {
      await this.contractInstance.mintCommon(this.owner.address, fakeAsset);
      const uri = await this.contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${this.contractInstance.address.toLowerCase()}/${tokenId}`);
    });

    it("should fail: URI query for nonexistent token", async function () {
      const uri = this.contractInstance.tokenURI(tokenId);
      await expect(uri).to.be.revertedWith("ERC721: invalid token ID");
    });
  });
}

import { expect } from "chai";

import { baseTokenURI, templateId, tokenId } from "../../constants";

export function shouldGetTokenURI() {
  describe("tokenURI", function () {
    it("should get token uri", async function () {
      await this.erc721Instance.mintCommon(this.owner.address, templateId);
      const uri = await this.erc721Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}${this.erc721Instance.address.toLowerCase()}/${tokenId}`);
    });

    it("should fail: URI query for nonexistent token", async function () {
      const uri = this.erc721Instance.tokenURI(tokenId);
      await expect(uri).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
    });
  });
}

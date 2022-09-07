import { expect } from "chai";

import { baseTokenURI, templateId, tokenId } from "../../../constants";

export function shouldGetTokenURI() {
  describe("tokenURI", function () {
    it("should get token uri", async function () {
      await this.contractInstance.mintCommon(this.owner.address, templateId);
      const uri = await this.contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${this.contractInstance.address.toLowerCase()}/${tokenId}`);
    });

    // setTokenURI is not supported

    it("should fail: URI query for nonexistent token", async function () {
      const uri = this.contractInstance.tokenURI(tokenId);
      await expect(uri).to.be.revertedWith("ERC721: invalid token ID");
    });
  });
}

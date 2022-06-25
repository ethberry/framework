import { expect } from "chai";

import { templateId, tokenId } from "../../constants";

export function shouldSetBaseURI() {
  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const newURI = "http://example.com/";
      await this.erc721Instance.mintCommon(this.owner.address, templateId);
      await this.erc721Instance.setBaseURI(newURI);
      const uri = await this.erc721Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${newURI}/${this.erc721Instance.address.toLowerCase()}/${tokenId}`);
    });
  });
}

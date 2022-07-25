import { expect } from "chai";

import { fakeAsset, tokenId } from "../../constants";

export function shouldSetBaseURI() {
  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const newURI = "http://example.com/";
      await this.contractInstance.mintCommon(this.owner.address, fakeAsset);
      await this.contractInstance.setBaseURI(newURI);
      const uri = await this.contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(`${newURI}/${this.contractInstance.address.toLowerCase()}/${tokenId}`);
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";

import { templateId, tokenId } from "../../../constants";
import { deployErc721Fixture } from "../fixture";

export function shouldSetBaseURI(name: string) {
  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const newURI = "http://example.com/";
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      await contractInstance.mintCommon(owner.address, templateId);
      await contractInstance.setBaseURI(newURI);
      const uri = await contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(`${newURI}/${contractInstance.address.toLowerCase()}/${tokenId}`);
    });
  });
}

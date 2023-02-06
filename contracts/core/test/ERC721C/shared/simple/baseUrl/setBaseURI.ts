import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { tokenInitialAmount } from "@gemunion/contracts-constants";

import { tokenId } from "../../../../constants";

export function shouldSetBaseURI(factory: () => Promise<Contract>) {
  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const newURI = "http://example.com/";
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mintCommon(owner.address, tokenInitialAmount + tokenId);
      await contractInstance.setBaseURI(newURI);
      const uri = await contractInstance.tokenURI(tokenInitialAmount + tokenId);
      expect(uri).to.equal(`${newURI}/${contractInstance.address.toLowerCase()}/${tokenInitialAmount + tokenId}`);
    });
  });
}

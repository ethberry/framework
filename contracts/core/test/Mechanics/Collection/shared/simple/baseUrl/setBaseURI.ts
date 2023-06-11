import { expect } from "chai";
import { ethers } from "hardhat";

import { batchSize } from "@gemunion/contracts-constants";

import { tokenId } from "../../../../../constants";

export function shouldSetBaseURI(factory: () => Promise<any>) {
  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const newURI = "http://example.com/";
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mintCommon(owner.address, batchSize + tokenId);
      await contractInstance.setBaseURI(newURI);
      const uri = await contractInstance.tokenURI(batchSize + tokenId);
      expect(uri).to.equal(`${newURI}/${(await contractInstance.getAddress()).toLowerCase()}/${batchSize + tokenId}`);
    });
  });
}

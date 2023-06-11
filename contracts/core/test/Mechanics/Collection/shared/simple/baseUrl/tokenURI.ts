import { expect } from "chai";
import { ethers } from "hardhat";

import { baseTokenURI, batchSize } from "@gemunion/contracts-constants";

import { tokenId } from "../../../../../constants";

export function shouldTokenURI(factory: () => Promise<any>) {
  describe("tokenURI", function () {
    it("should get token uri", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mintCommon(owner.address, batchSize + tokenId);
      const uri = await contractInstance.tokenURI(batchSize + tokenId);
      expect(uri).to.equal(
        `${baseTokenURI}/${(await contractInstance.getAddress()).toLowerCase()}/${batchSize + tokenId}`,
      );
    });

    // setTokenURI is not supported

    it("should fail: URI query for nonexistent token", async function () {
      const contractInstance = await factory();

      const uri = contractInstance.tokenURI(batchSize + tokenId);
      await expect(uri).to.be.revertedWith("ERC721: invalid token ID");
    });
  });
}

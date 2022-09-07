import { expect } from "chai";
import { ethers } from "hardhat";

import { baseTokenURI, templateId, tokenId } from "../../../constants";
import { deployErc721Fixture } from "../fixture";

export function shouldGetTokenURI(name: string) {
  describe("tokenURI", function () {
    it("should get token uri", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      await contractInstance.mintCommon(owner.address, templateId);
      const uri = await contractInstance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${contractInstance.address.toLowerCase()}/${tokenId}`);
    });

    // setTokenURI is not supported

    it("should fail: URI query for nonexistent token", async function () {
      const { contractInstance } = await deployErc721Fixture(name);

      const uri = contractInstance.tokenURI(tokenId);
      await expect(uri).to.be.revertedWith("ERC721: invalid token ID");
    });
  });
}

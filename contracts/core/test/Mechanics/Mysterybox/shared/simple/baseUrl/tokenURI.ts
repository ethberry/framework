import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { baseTokenURI } from "@gemunion/contracts-constants";
import type { IERC721EnumOptions } from "@gemunion/contracts-erc721-enumerable";
import { defaultMintERC721 } from "@gemunion/contracts-erc721-enumerable";

export function shouldTokenURI(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0 } = options;

  describe("tokenURI", function () {
    it("should get token uri", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const uri = await contractInstance.tokenURI(defaultTokenId);
      expect(uri).to.equal(`${baseTokenURI}/${contractInstance.address.toLowerCase()}/${defaultTokenId}`);
    });

    // setTokenURI is not supported

    it("should fail: URI query for nonexistent token", async function () {
      const contractInstance = await factory();

      const uri = contractInstance.tokenURI(defaultTokenId);
      await expect(uri).to.be.revertedWith("ERC721: invalid token ID");
    });
  });
}

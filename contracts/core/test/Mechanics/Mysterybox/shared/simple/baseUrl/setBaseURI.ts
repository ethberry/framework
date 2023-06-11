import { expect } from "chai";
import { ethers } from "hardhat";

import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";
import { defaultMintERC721 } from "@gemunion/contracts-erc721e";

export function shouldSetBaseURI(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = defaultMintERC721, tokenId: defaultTokenId = 0 } = options;

  describe("setBaseURI", function () {
    it("should set token uri", async function () {
      const newURI = "http://example.com/";
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.setBaseURI(newURI);
      const uri = await contractInstance.tokenURI(defaultTokenId);
      expect(uri).to.equal(`${newURI}/${(await contractInstance.getAddress()).toLowerCase()}/${defaultTokenId}`);
    });
  });
}

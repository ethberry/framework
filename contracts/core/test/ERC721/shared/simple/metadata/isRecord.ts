import { expect } from "chai";
import { ethers } from "hardhat";
import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";

import { customMintCommonERC721 } from "../../customMintFn";

export function shouldIsRecord(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = customMintCommonERC721, tokenId: defaultTokenId = 0n } = options;

  describe("isRecord", function () {
    it("should check record", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const isIndeed = await contractInstance.isRecord(defaultTokenId);
      expect(isIndeed).to.equal(true);
    });

    it("should check record (empty)", async function () {
      const contractInstance = await factory();

      const isIndeed = await contractInstance.isRecord(defaultTokenId);
      expect(isIndeed).to.equal(false);
    });
  });
}

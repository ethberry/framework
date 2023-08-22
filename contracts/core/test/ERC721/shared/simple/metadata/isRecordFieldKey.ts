import { expect } from "chai";
import { ethers } from "hardhat";

import { TEMPLATE_ID } from "@gemunion/contracts-constants";
import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";

import { customMintCommonERC721 } from "../../customMintFn";

export function shouldIsRecordFieldKey(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = customMintCommonERC721, tokenId: defaultTokenId = 0n } = options;

  describe("isRecordFieldKey", function () {
    it("should check record field", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const isIndeed = await contractInstance.isRecordFieldKey(defaultTokenId, TEMPLATE_ID);
      expect(isIndeed).to.equal(true);
    });

    it("should check record (empty)", async function () {
      const contractInstance = await factory();

      const isIndeed = await contractInstance.isRecordFieldKey(defaultTokenId, TEMPLATE_ID);
      expect(isIndeed).to.equal(false);
    });
  });
}

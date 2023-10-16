import { expect } from "chai";
import { ethers } from "hardhat";

import { TEMPLATE_ID } from "@gemunion/contracts-constants";
import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";

import { templateId } from "../../../../constants";
import { customMintCommonERC721 } from "../../customMintFn";

export function shouldGetRecordFieldValue(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = customMintCommonERC721, tokenId: defaultTokenId = 0n } = options;

  describe("getRecordFieldValue", function () {
    it("should get value", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const value = await contractInstance.getRecordFieldValue(defaultTokenId, TEMPLATE_ID);
      expect(value).to.equal(templateId);
    });

    it("should get value (empty)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.getRecordFieldValue(defaultTokenId, TEMPLATE_ID);
      await expect(tx)
        .to.be.revertedWithCustomError(contractInstance, "FieldNotFound")
        .withArgs(defaultTokenId, TEMPLATE_ID);
    });
  });
}

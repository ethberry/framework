import { expect } from "chai";
import { ethers } from "hardhat";

import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";

import { FrameworkInterfaceId } from "../../../../constants";
import { customMintCommonERC721 } from "../../customMintFn";

export function shouldGetRecordFieldKeyCount(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = customMintCommonERC721, tokenId: defaultTokenId = 0n } = options;

  describe("getRecordFieldKeyCount", function () {
    it("should get count", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const count = await contractInstance.getRecordFieldKeyCount(defaultTokenId);

      const isSupported = await contractInstance.supportsInterface(FrameworkInterfaceId.ERC721Random);
      if (isSupported) {
        expect(count).to.equal(2);
      } else {
        expect(count).to.equal(1);
      }
    });

    it("should get count (never set)", async function () {
      const contractInstance = await factory();

      const tx = contractInstance.getRecordFieldKeyCount(0);
      await expect(tx).to.be.revertedWith("GC: record not found");
    });
  });
}

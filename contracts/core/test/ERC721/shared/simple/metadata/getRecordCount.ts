import { expect } from "chai";
import { ethers } from "hardhat";
import { IERC721EnumOptions } from "@gemunion/contracts-erc721e";

import { customMintCommonERC721 } from "../../customMintFn";

export function shouldGetRecordCount(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = customMintCommonERC721 } = options;

  describe("getRecordCount", function () {
    it("should get count", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const count = await contractInstance.getRecordCount();
      expect(count).to.equal(1);
    });

    it("should get count (never set)", async function () {
      const contractInstance = await factory();

      const count = await contractInstance.getRecordCount();
      expect(count).to.equal(0);
    });
  });
}

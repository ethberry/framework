import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import type { IERC721EnumOptions } from "@gemunion/contracts-erc721-enumerable";

import { tokenId } from "../../../constants";
import { customMintCommonERC721 } from "../customMintFn";

export function shouldSafeTransferFrom(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  const { mint = customMintCommonERC721, tokenId: defaultTokenId = tokenId } = options;

  describe("safeTransferFrom", function () {
    it("should fail: can't be transferred", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const tx = contractInstance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        receiver.address,
        defaultTokenId,
      );
      await expect(tx).to.be.revertedWith("ERC721Soulbound: can't be transferred");
    });

    it("should fail: can't be transferred by approved", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, defaultTokenId);

      const tx = contractInstance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, receiver.address, defaultTokenId);
      await expect(tx).to.be.revertedWith("ERC721Soulbound: can't be transferred");
    });
  });
}

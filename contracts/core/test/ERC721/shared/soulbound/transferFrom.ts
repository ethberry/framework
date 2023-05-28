import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";

import { tokenId } from "../../../constants";
import { customMintCommonERC721 } from "../customMintFn";

export function shouldTransferFrom(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  const { mint = customMintCommonERC721, tokenId: defaultTokenId = tokenId } = options;

  describe("transferFrom", function () {
    it("should fail: can't be transferred", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const tx1 = contractInstance.transferFrom(owner.address, receiver.address, defaultTokenId);
      await expect(tx1).to.be.revertedWith("ERC721Soulbound: can't be transferred");
    });

    it("should fail: can't be transferred by approved", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, defaultTokenId);

      const tx1 = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, defaultTokenId);
      await expect(tx1).to.be.revertedWith("ERC721Soulbound: can't be transferred");
    });
  });
}

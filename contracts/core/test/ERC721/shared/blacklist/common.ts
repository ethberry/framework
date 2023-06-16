import { expect } from "chai";
import { ethers } from "hardhat";

import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";

import { tokenId } from "../../../constants";
import { customMintCommonERC721 } from "../customMintFn";

export function shouldBehaveLikeERC721Blacklist(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = customMintCommonERC721, tokenId: defaultTokenId = tokenId } = options;
  describe("Black list", function () {
    it("should fail: transferFrom from", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, receiver.address);
      await contractInstance.blacklist(receiver.address);
      const tx1 = contractInstance.connect(receiver).transferFrom(receiver.address, owner.address, defaultTokenId);
      await expect(tx1).to.be.revertedWith("Blacklist: sender is blacklisted");

      const tx2 = contractInstance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](receiver.address, owner.address, defaultTokenId);
      await expect(tx2).to.be.revertedWith("Blacklist: sender is blacklisted");
    });

    it("should fail: transferFrom to", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.blacklist(receiver.address);
      const tx1 = contractInstance.transferFrom(owner.address, receiver.address, defaultTokenId);
      await expect(tx1).to.be.revertedWith("Blacklist: receiver is blacklisted");

      const tx2 = contractInstance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        receiver.address,
        defaultTokenId,
      );
      await expect(tx2).to.be.revertedWith("Blacklist: receiver is blacklisted");
    });

    it("should fail: transfer approved", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, receiver.address);
      await contractInstance.blacklist(receiver.address);
      await contractInstance.connect(receiver).approve(owner.address, defaultTokenId);

      const tx1 = contractInstance.transferFrom(receiver.address, owner.address, defaultTokenId);
      await expect(tx1).to.be.revertedWith("Blacklist: sender is blacklisted");

      const tx2 = contractInstance["safeTransferFrom(address,address,uint256)"](
        receiver.address,
        owner.address,
        defaultTokenId,
      );
      await expect(tx2).to.be.revertedWith("Blacklist: sender is blacklisted");
    });

    it("should fail: mintCommon", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.blacklist(receiver.address);
      const tx = mint(contractInstance, owner, receiver.address);
      await expect(tx).to.be.revertedWith(`Blacklist: receiver is blacklisted`);
    });

    it("should fail: burn", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, receiver.address);
      await contractInstance.blacklist(receiver.address);

      const tx = contractInstance.connect(receiver).burn(defaultTokenId);
      await expect(tx).to.be.revertedWith("Blacklist: sender is blacklisted");
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBeAccessible } from "@gemunion/contracts-mocha";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, templateId, tokenId } from "../constants";

import { shouldTokenURI } from "./shared/simple/baseUrl/tokenURI";
import { shouldSetBaseURI } from "./shared/simple/baseUrl/setBaseURI";

import { deployErc721Base } from "./shared/fixtures";
import { shouldSetApprovalForAll } from "./shared/simple/base/setApprovalForAll";
import { shouldMint } from "./shared/simple/base/mint";
import { shouldApprove } from "./shared/simple/base/approve";
import { shouldSafeMint } from "./shared/simple/base/safeMint";
import { shouldGetBalanceOf } from "./shared/simple/base/balanceOf";
import { shouldGetOwnerOf } from "./shared/simple/base/ownerOf";
import { shouldERC721Burnable } from "./shared/simple/burnable";

describe("ERC721Soulbound", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldMint(factory);
  shouldSafeMint(factory);
  shouldApprove(factory);
  shouldGetBalanceOf(factory);
  shouldGetOwnerOf(factory);
  shouldSetApprovalForAll(factory);
  // shouldTransferFrom(name);
  // shouldSafeTransferFrom(name);
  shouldERC721Burnable(factory);

  shouldSetBaseURI(factory);
  shouldTokenURI(factory);

  describe("transferFrom", function () {
    it("should fail: can't be transferred", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mintCommon(owner.address, templateId);
      const tx = contractInstance.transferFrom(owner.address, receiver.address, tokenId);

      await expect(tx).to.be.revertedWith("ERC721Soulbound: can't be transferred");
    });
  });

  describe("safeTransferFrom", function () {
    it("should fail: can't be transferred", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mintCommon(owner.address, templateId);
      const tx = contractInstance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        receiver.address,
        tokenId,
      );
      await expect(tx).to.be.revertedWith("ERC721Soulbound: can't be transferred");
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, templateId, tokenId } from "../constants";

import { shouldTokenURI } from "./shared/simple/baseUrl/tokenURI";
import { shouldSetBaseURI } from "./shared/simple/baseUrl/setBaseURI";
import { shouldMint } from "./shared/simple/base/mint";
import { shouldSafeMint } from "./shared/simple/base/safeMint";
import { shouldApprove } from "./shared/simple/base/approve";
import { shouldBalanceOf } from "./shared/simple/base/balanceOf";
import { shouldBurn } from "./shared/simple/burnable/burn";
import { shouldOwnerOf } from "./shared/simple/base/ownerOf";
import { shouldSetApprovalForAll } from "./shared/simple/base/setApprovalForAll";
import { deployErc721Base } from "./shared/fixtures";
import { shouldERC721Accessible } from "./shared/accessible";

describe("ERC721Soulbound", function () {
  const name = "ERC721Soulbound";

  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldApprove(name);
  shouldBalanceOf(name);
  shouldBurn(name);
  shouldOwnerOf(name);
  shouldSetApprovalForAll(name);
  // shouldTransferFrom(name);
  // shouldSafeTransferFrom(name);

  shouldMint(name);
  shouldSafeMint(name);

  shouldSetBaseURI(name);
  shouldTokenURI(name);

  describe("transferFrom", function () {
    it("should fail: can't be transferred", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      await contractInstance.mintCommon(owner.address, templateId);
      const tx = contractInstance.transferFrom(owner.address, receiver.address, tokenId);

      await expect(tx).to.be.revertedWith("ERC721Soulbound: can't be transferred");
    });
  });

  describe("safeTransferFrom", function () {
    it("should fail: can't be transferred", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

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

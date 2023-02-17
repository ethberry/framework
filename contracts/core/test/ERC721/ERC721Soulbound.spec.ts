import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { templateId, tokenId } from "../constants";

import { shouldTokenURI } from "./shared/simple/baseUrl/tokenURI";
import { shouldSetBaseURI } from "./shared/simple/baseUrl/setBaseURI";

import { deployERC721 } from "./shared/fixtures";
import { shouldSetApprovalForAll } from "./shared/simple/base/setApprovalForAll";
import { shouldMint } from "./shared/simple/base/mint";
import { shouldApprove } from "./shared/simple/base/approve";
import { shouldSafeMint } from "./shared/simple/base/safeMint";
import { shouldGetBalanceOf } from "./shared/simple/base/balanceOf";
import { shouldGetOwnerOf } from "./shared/simple/base/ownerOf";
import { shouldBehaveLikeERC721Burnable } from "./shared/simple/burnable";

describe("ERC721Soulbound", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldMint(factory);
  shouldSafeMint(factory);
  shouldApprove(factory);
  shouldGetBalanceOf(factory);
  shouldGetOwnerOf(factory);
  shouldSetApprovalForAll(factory);
  // shouldTransferFrom(name);
  // shouldSafeTransferFrom(name);
  shouldBehaveLikeERC721Burnable(factory);

  shouldSetBaseURI(factory);
  shouldTokenURI(factory);

  describe("transferFrom", function () {
    it("should fail: can't be transferred", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mintCommon(owner.address, templateId);
      const tx1 = contractInstance.transferFrom(owner.address, receiver.address, tokenId);
      await expect(tx1).to.be.revertedWith("ERC721Soulbound: can't be transferred");

      const tx2 = contractInstance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        receiver.address,
        tokenId,
      );
      await expect(tx2).to.be.revertedWith("ERC721Soulbound: can't be transferred");
    });
  });

  describe("safeTransferFrom", function () {
    it("should fail: can't be transferred", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mintCommon(owner.address, templateId);
      await contractInstance.approve(receiver.address, tokenId);

      const tx1 = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, tokenId);
      await expect(tx1).to.be.revertedWith("ERC721Soulbound: can't be transferred");

      const tx2 = contractInstance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, receiver.address, tokenId);
      await expect(tx2).to.be.revertedWith("ERC721Soulbound: can't be transferred");
    });
  });

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721);
});

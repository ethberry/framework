import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import {
  shouldApprove,
  shouldGetBalanceOf,
  shouldGetOwnerOf,
  shouldSetApprovalForAll,
  // shouldSafeMint,
} from "@gemunion/contracts-erc721-enumerable";

import { templateId, tokenId } from "../constants";

import { shouldNotMint } from "./shared/simple/base/shouldNotMint";
import { shouldNotSafeMint } from "./shared/simple/base/shouldNotSafeMint";
import { shouldBaseUrl } from "./shared/simple/baseUrl";

import { deployERC721 } from "./shared/fixtures";
import { shouldBehaveLikeERC721Burnable } from "./shared/simple/burnable";
import { customMintCommonERC721 } from "./shared/customMintFn";

describe("ERC721SoulboundVotes", function () {
  const factory = () => deployERC721(this.title);
  const options = { mint: customMintCommonERC721, tokenId };

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldApprove(factory, options);
  shouldGetBalanceOf(factory, options);
  shouldGetOwnerOf(factory, options);
  shouldSetApprovalForAll(factory, options);
  // shouldTransferFrom(name);
  // shouldSafeTransferFrom(name);

  shouldNotMint(factory);
  shouldNotSafeMint(factory);
  shouldBaseUrl(factory);
  shouldBehaveLikeERC721Burnable(factory);

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

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721]);
});

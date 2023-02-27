import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { amount, DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import {
  shouldBalanceOf,
  shouldBalanceOfBatch,
  shouldBehaveLikeERC1155Burnable,
  shouldBehaveLikeERC1155Royalty,
  shouldBehaveLikeERC1155Supply,
  shouldCustomURI,
  shouldMint,
  shouldMintBatch,
  shouldSetApprovalForAll,
} from "@gemunion/contracts-erc1155";

import { deployERC1155 } from "./shared/fixtures";
import { tokenId } from "../constants";

describe("ERC1155Soulbound", function () {
  const factory = () => deployERC1155(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldMint(factory, { minterRole: MINTER_ROLE });
  shouldMintBatch(factory, { minterRole: MINTER_ROLE });
  shouldBalanceOf(factory);
  shouldBalanceOfBatch(factory);
  shouldSetApprovalForAll(factory);
  shouldCustomURI(factory);

  shouldBehaveLikeERC1155Burnable(factory);
  shouldBehaveLikeERC1155Royalty(factory);
  shouldBehaveLikeERC1155Supply(factory);

  describe("shouldSafeTransferFrom", function () {
    it("should fail: can't be transferred", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      const tx = contractInstance.safeTransferFrom(owner.address, receiver.address, tokenId, amount, "0x");
      await expect(tx).to.be.revertedWith("ERC1155Soulbound: can't be transferred");
    });
  });

  describe("safeBatchTransferFrom", function () {
    it("should fail: can't be transferred", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      const tx = contractInstance.safeBatchTransferFrom(owner.address, receiver.address, [tokenId], [amount], "0x");
      await expect(tx).to.be.revertedWith("ERC1155Soulbound: can't be transferred");
    });
  });

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC1155);
});

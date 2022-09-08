import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, templateId, tokenId } from "../constants";

import { shouldHaveRole } from "./shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "./shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "./shared/accessControl/grantRole";
import { shouldRevokeRole } from "./shared/accessControl/revokeRole";
import { shouldRenounceRole } from "./shared/accessControl/renounceRole";

import { shouldGetTokenURI } from "./shared/common/tokenURI";
import { shouldSetBaseURI } from "./shared/common/setBaseURI";
import { shouldMint } from "./shared/mint";
import { shouldMintCommon } from "./shared/common/mintCommon";
import { shouldSafeMint } from "./shared/safeMint";
import { shouldApprove } from "./shared/common/approve";
import { shouldGetBalanceOf } from "./shared/common/balanceOf";
import { shouldBurn } from "./shared/common/burn";
import { shouldGetOwnerOf } from "./shared/common/ownerOf";
import { shouldSetApprovalForAll } from "./shared/common/setApprovalForAll";
import { deployErc721Fixture } from "./shared/fixture";

describe("ERC721Soulbound", function () {
  const name = "ERC721Soulbound";

  shouldHaveRole(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetRoleAdmin(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGrantRole(name);
  shouldRevokeRole(name);
  shouldRenounceRole(name);

  shouldMintCommon(name);
  shouldMint(name);
  shouldSafeMint(name);
  shouldApprove(name);
  shouldGetBalanceOf(name);
  shouldBurn(name);
  shouldGetOwnerOf(name);
  shouldSetApprovalForAll(name);
  shouldGetTokenURI(name);
  shouldSetBaseURI(name);

  describe("transferFrom", function () {
    it("should fail: can't be transferred", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      await contractInstance.mintCommon(owner.address, templateId);
      const tx = contractInstance.transferFrom(owner.address, receiver.address, tokenId);

      await expect(tx).to.be.revertedWith("ERC721Soulbound: can't be transferred");
    });
  });

  describe("safeTransferFrom", function () {
    it("should fail: can't be transferred", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

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

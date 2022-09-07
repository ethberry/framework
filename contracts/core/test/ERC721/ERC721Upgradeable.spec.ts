import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, templateId, tokenId } from "../constants";

import { shouldHaveRole } from "./shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "./shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "./shared/accessControl/grantRole";
import { shouldRevokeRole } from "./shared/accessControl/revokeRole";
import { shouldRenounceRole } from "./shared/accessControl/renounceRole";

import { shouldGetTokenURI } from "./shared/common/tokenURI";
import { shouldSetBaseURI } from "./shared/common/setBaseURI";
import { shouldMintCommon } from "./shared/common/mintCommon";
import { shouldMint } from "./shared/mint";
import { shouldSafeMint } from "./shared/safeMint";
import { shouldApprove } from "./shared/common/approve";
import { shouldGetBalanceOf } from "./shared/common/balanceOf";
import { shouldBurn } from "./shared/common/burn";
import { shouldGetOwnerOf } from "./shared/common/ownerOf";
import { shouldSetApprovalForAll } from "./shared/common/setApprovalForAll";
import { shouldTransferFrom } from "./shared/common/transferFrom";
import { shouldSafeTransferFrom } from "./shared/common/safeTransferFrom";
import { deployErc721Fixture } from "./shared/fixture";

describe("ERC721Upgradeable", function () {
  const name = "ERC721Upgradeable";

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
  shouldTransferFrom(name);
  shouldSafeTransferFrom(name);
  shouldGetTokenURI(name);
  shouldSetBaseURI(name);

  describe("getRecordFieldValue", function () {
    it("should get record field value", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      await contractInstance.mintCommon(receiver.address, templateId);
      const value = await contractInstance.getRecordFieldValue(
        tokenId,
        utils.keccak256(ethers.utils.toUtf8Bytes("GRADE")),
      );
      expect(value).to.equal(1);
    });

    it("should fail: field not found", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      await contractInstance.mintCommon(receiver.address, templateId);
      const value = contractInstance.getRecordFieldValue(
        tokenId,
        utils.keccak256(ethers.utils.toUtf8Bytes("non-existing-field")),
      );
      await expect(value).to.be.revertedWith("GC: field not found");
    });
  });

  describe("upgrade", function () {
    it("should level up", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      await contractInstance.mintCommon(receiver.address, templateId);

      const tx1 = contractInstance.upgrade(tokenId);
      await expect(tx1).to.not.be.reverted;

      const value2 = await contractInstance.getRecordFieldValue(
        tokenId,
        utils.keccak256(ethers.utils.toUtf8Bytes("GRADE")),
      );
      expect(value2).to.equal(2);
    });

    it("should fail: insufficient permissions", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      await contractInstance.mintCommon(receiver.address, templateId);

      const tx1 = contractInstance.connect(receiver).upgrade(tokenId);
      await expect(tx1).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });
  });
});

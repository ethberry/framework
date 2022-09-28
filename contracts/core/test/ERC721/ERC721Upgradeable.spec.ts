import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, templateId, tokenId } from "../constants";
import { shouldMintCommon } from "./shared/mintCommon";
import { deployErc721Base } from "./shared/fixtures";
import { shouldERC721Accessible } from "./shared/accessible";
import { shouldERC721Simple } from "./shared/simple";

describe("ERC721Upgradeable", function () {
  const name = "ERC721Upgradeable";

  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Simple(name);

  shouldMintCommon(name);

  describe("getRecordFieldValue", function () {
    it("should get record field value", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      await contractInstance.mintCommon(receiver.address, templateId);
      const value = await contractInstance.getRecordFieldValue(
        tokenId,
        utils.keccak256(ethers.utils.toUtf8Bytes("GRADE")),
      );
      expect(value).to.equal(1);
    });

    it("should fail: field not found", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

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
      const { contractInstance } = await deployErc721Base(name);

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
      const { contractInstance } = await deployErc721Base(name);

      await contractInstance.mintCommon(receiver.address, templateId);

      const tx1 = contractInstance.connect(receiver).upgrade(tokenId);
      await expect(tx1).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });
  });
});

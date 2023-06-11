import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256, toUtf8Bytes } from "ethers";
import { METADATA_ROLE } from "@gemunion/contracts-constants";

import { templateId, tokenId } from "../../constants";
import { TokenMetadata } from "@framework/types";

export function shouldBehaveLikeUpgradeable(factory: () => Promise<any>) {
  describe("upgrade", function () {
    it("should: upgrade level", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();

      await contractInstance.mintCommon(receiver.address, templateId);

      const tx = contractInstance.upgrade(tokenId);
      await expect(tx)
        .to.emit(contractInstance, "LevelUp")
        .withArgs(owner.address, tokenId, 1)
        .to.emit(contractInstance, "MetadataUpdate")
        .withArgs(tokenId);

      const value = await contractInstance.getRecordFieldValue(tokenId, keccak256(toUtf8Bytes(TokenMetadata.GRADE)));

      expect(value).to.equal(1);
    });

    it("should fail: wrong role", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();

      await contractInstance.mintCommon(receiver.address, templateId);

      const tx = contractInstance.connect(receiver).upgrade(tokenId);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${METADATA_ROLE}`,
      );
    });
  });
}

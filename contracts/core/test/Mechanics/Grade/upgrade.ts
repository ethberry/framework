import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, utils } from "ethers";
import { METADATA_ROLE } from "@gemunion/contracts-constants";

import { templateId, tokenId } from "../../constants";
import { TokenAttributes } from "@framework/types";

export function shouldBehaveLikeUpgradeable(factory: () => Promise<Contract>) {
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

      const value = await contractInstance.getRecordFieldValue(
        tokenId,
        utils.keccak256(utils.toUtf8Bytes(TokenAttributes.GRADE)),
      );

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

import { expect } from "chai";
import { ethers } from "hardhat";

import { MINTER_ROLE } from "@gemunion/contracts-constants";

import { templateId } from "../../../../../constants";

export function shouldMintBox(factory: () => Promise<any>) {
  describe("mint", function () {
    it("should fail: No content", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const mysteryboxInstance = await factory();

      const tx1 = mysteryboxInstance.mintBox(receiver.address, templateId, []);

      await expect(tx1).to.be.revertedWith("Mysterybox: no content");
    });

    it("should fail: wrong role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).mintBox(receiver.address, templateId, []);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });
  });
}

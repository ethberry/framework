import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { MINTER_ROLE } from "@gemunion/contracts-constants";

import { templateId } from "../../../constants";

export function shouldMintRandom(factory: () => Promise<Contract>) {
  describe("mintRandom", function () {
    // TODO positive case

    it("should fail: wrong role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).mintRandom(receiver.address, templateId);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });
  });
}

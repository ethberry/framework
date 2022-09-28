import { expect } from "chai";
import { ethers } from "hardhat";

import { MINTER_ROLE, templateId } from "../../../constants";
import { deployErc721Base } from "../fixtures";

export function shouldMintRandom(name: string) {
  describe("mintRandom", function () {
    // TODO possitive case

    it("should fail: wrong role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Base(name);

      const tx = contractInstance.connect(receiver).mintRandom(receiver.address, templateId);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { MINTER_ROLE } from "@gemunion/contracts-constants";

export function shouldNotMintCommon(factory: () => Promise<Contract>) {
  describe("mintCommon", function () {
    it("should fail: MethodNotSupported", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.mintCommon(receiver.address, 1);
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "MethodNotSupported");
    });

    it("should fail: wrong role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).mintCommon(receiver.address, 1);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });
  });
}

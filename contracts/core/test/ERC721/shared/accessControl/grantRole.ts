import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE } from "../../../constants";
import { deployErc721Fixture } from "../fixture";

export function shouldGrantRole(name: string) {
  describe("grantRole", function () {
    it("Should grant role", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      const tx1 = await contractInstance.grantRole(DEFAULT_ADMIN_ROLE, receiver.address);
      await expect(tx1)
        .to.emit(contractInstance, "RoleGranted")
        .withArgs(DEFAULT_ADMIN_ROLE, receiver.address, owner.address);
    });

    it("should fail: wrong role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc721Fixture(name);

      const tx1 = contractInstance.connect(receiver).grantRole(DEFAULT_ADMIN_ROLE, receiver.address);
      await expect(tx1).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });
  });
}

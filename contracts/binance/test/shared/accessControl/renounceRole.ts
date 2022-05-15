import { expect } from "chai";

import { DEFAULT_ADMIN_ROLE } from "../../constants";
import { ethers } from "hardhat";

export function shouldRenounceRole() {
  describe("shouldRenounceRole", function () {
    it("Should revoke role (has no role)", async function () {
      const NON_EXISTING_ROLE = ethers.utils.id("NON_EXISTING_ROLE");

      const tx1 = await this.contractInstance.renounceRole(NON_EXISTING_ROLE, this.owner.address);
      await expect(tx1).to.not.emit(this.contractInstance, "RoleRevoked");
    });

    it("Should renounce role", async function () {
      const tx1 = await this.contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      await expect(tx1)
        .to.emit(this.contractInstance, "RoleRevoked")
        .withArgs(DEFAULT_ADMIN_ROLE, this.owner.address, this.owner.address);
    });

    it("should fail: wrong account", async function () {
      const tx1 = this.contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, this.receiver.address);
      await expect(tx1).to.be.revertedWith("AccessControl: can only renounce roles for self");
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE } from "../constants";
import { shouldRevokeRole } from "./shared/accessControl/revokeRole";
import { shouldGrantRole } from "./shared/accessControl/grantRole";
import { shouldGetRoleAdmin } from "./shared/accessControl/getRoleAdmin";
import { shouldHaveRole } from "./shared/accessControl/hasRoles";
import { shouldRenounceRole } from "./shared/accessControl/renounceRole";
import { shouldReceive } from "./shared/receive";
import { shouldSnapshot } from "./shared/snapshot";
import { shouldTransfer } from "./shared/transfer";
import { shouldCap } from "./shared/cap";
import { shouldBalanceOf } from "./shared/balanceOf";
import { shouldBurnFrom } from "./shared/burnFrom";
import { shouldApprove } from "./shared/approve";
import { shouldBurn } from "./shared/burn";
import { shouldTransferFrom } from "./shared/transferFrom";
import { shouldMint } from "./shared/mint";
import { deployErc20Fixture } from "./shared/fixture";

describe("ERC20Blacklist", function () {
  const name = "ERC20Blacklist";

  shouldHaveRole(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldGetRoleAdmin(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldGrantRole(name);
  shouldRevokeRole(name);
  shouldRenounceRole(name);

  shouldMint(name);
  shouldBalanceOf(name);
  shouldTransfer(name);
  shouldTransferFrom(name);
  shouldSnapshot(name);
  shouldApprove(name);
  shouldBurn(name);
  shouldBurnFrom(name);
  shouldCap(name);
  shouldReceive(name);

  describe("Black list", function () {
    it("should fail to transfer to blacklisted", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Fixture(name);

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.transfer(receiver.address, amount);
      await expect(tx).to.be.revertedWith("Blacklist: receiver is blacklisted");
    });
  });
});

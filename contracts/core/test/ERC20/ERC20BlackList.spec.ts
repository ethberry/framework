import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBeAccessible } from "@gemunion/contracts-mocha";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE } from "@gemunion/contracts-constants";

import { deployErc20Base } from "./shared/fixtures";
import { shouldERC20Simple } from "./shared/simple";

describe("ERC20Blacklist", function () {
  const factory = () => deployErc20Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldERC20Simple(factory);

  describe("Black list", function () {
    it("should fail to transfer to blacklisted", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.transfer(receiver.address, amount);
      await expect(tx).to.be.revertedWith("Blacklist: receiver is blacklisted");
    });
  });
});

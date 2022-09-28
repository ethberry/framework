import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE } from "../constants";
import { deployErc20Base } from "./shared/fixtures";
import { shouldERC20Accessible } from "./shared/accessible";
import { shouldERC20Simple } from "./shared/simple";

describe("ERC20Blacklist", function () {
  const name = "ERC20Blacklist";

  shouldERC20Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldERC20Simple(name);

  describe("Black list", function () {
    it("should fail to transfer to blacklisted", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc20Base(name);

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.transfer(receiver.address, amount);
      await expect(tx).to.be.revertedWith("Blacklist: receiver is blacklisted");
    });
  });
});

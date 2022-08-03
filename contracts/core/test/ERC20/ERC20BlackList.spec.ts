import { expect } from "chai";
import { ethers } from "hardhat";

import { ERC20Blacklist } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE, tokenName, tokenSymbol } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";

describe("ERC20Blacklist", function () {
  let erc20Instance: ERC20Blacklist;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc20Factory = await ethers.getContractFactory("ERC20Blacklist");
    erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);

    this.contractInstance = erc20Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);

  describe("Black list", function () {
    it("should fail to transfer to blacklisted", async function () {
      await erc20Instance.blacklist(this.receiver.address);
      const tx = erc20Instance.transfer(this.receiver.address, amount);
      await expect(tx).to.be.revertedWith("ERC20Blacklist: receiver is BlackListed");
    });
  });
});

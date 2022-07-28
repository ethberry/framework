import { expect } from "chai";
import { ethers } from "hardhat";

import { ERC20Simple } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE, tokenName, tokenSymbol } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";

describe("ERC20Simple", function () {
  let erc20Instance: ERC20Simple;

  beforeEach(async function () {
    [this.owner] = await ethers.getSigners();

    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);

    this.contractInstance = erc20Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);

  describe("receive", function () {
    it("should fail: no reason", async function () {
      const tx = this.owner.sendTransaction({
        to: erc20Instance.address,
        value: ethers.constants.WeiPerEther,
        gasLimit: 21000 + 61, // + revert
      });

      await expect(tx).to.be.reverted;
    });
  });
});

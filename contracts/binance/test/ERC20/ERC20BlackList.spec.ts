import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC20BlackList } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE, tokenName, tokenSymbol } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";

describe("ERC20BlackList", function () {
  let erc20: ContractFactory;
  let erc20Instance: ERC20BlackList;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20BlackList");
    [this.owner, this.receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount)) as ERC20BlackList;

    this.contractInstance = erc20Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);

  describe("Black list", function () {
    it("should fail to transfer to blacklisted", async function () {
      await erc20Instance.blacklist(this.receiver.address);
      const tx = erc20Instance.transfer(this.receiver.address, amount);
      await expect(tx).to.be.revertedWith("ERC20BlackList: receiver is BlackListed");
    });
  });
});

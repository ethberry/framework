import { expect } from "chai";
import { ethers } from "hardhat";

import { ERC20Blacklist } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE, tokenName, tokenSymbol } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";
import { shouldMint } from "./shared/mint";
import { shouldSnapshot } from "./shared/snapshot";
import { shouldTransfer } from "./shared/transfer";
import { shouldCap } from "./shared/cap";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldBalanceOf } from "./shared/balanceOf";
import { shouldBurn } from "./shared/burn";
import { shouldBurnFrom } from "./shared/burnFrom";
import { shouldApprove } from "./shared/approve";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldTransferFrom } from "./shared/transferFrom";
import { shouldReceive } from "./shared/receive";

describe("ERC20Blacklist", function () {
  let erc20Instance: ERC20Blacklist;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc20Factory = await ethers.getContractFactory("ERC20Blacklist");
    erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);

    const erc20NonReceiverFactory = await ethers.getContractFactory("ERC20NonReceiverMock");
    this.erc20NonReceiverInstance = await erc20NonReceiverFactory.deploy();

    this.contractInstance = erc20Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
  shouldMint();
  shouldBalanceOf(true);
  shouldTransfer();
  shouldTransferFrom();
  shouldSnapshot();
  shouldApprove();
  shouldBurn();
  shouldBurnFrom();
  shouldCap();
  shouldReceive();

  describe("Black list", function () {
    it("should fail to transfer to blacklisted", async function () {
      await erc20Instance.blacklist(this.receiver.address);
      const tx = erc20Instance.transfer(this.receiver.address, amount);
      await expect(tx).to.be.revertedWith("Blacklist: receiver is blacklisted");
    });
  });
});

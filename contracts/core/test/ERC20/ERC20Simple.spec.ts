import { ethers } from "hardhat";

import { ERC20Simple } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE, tokenName, tokenSymbol } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessControl/grantRole";
import { shouldRevokeRole } from "../shared/accessControl/revokeRole";
import { shouldRenounceRole } from "../shared/accessControl/renounceRole";
import { shouldMint } from "./shared/mint";
import { shouldBalanceOf } from "./shared/balanceOf";
import { shouldTransfer } from "./shared/transfer";
import { shouldTransferFrom } from "./shared/transferFrom";
import { shouldSnapshot } from "./shared/snapshot";
import { shouldApprove } from "./shared/approve";
import { shouldBurn } from "./shared/burn";
import { shouldBurnFrom } from "./shared/burnFrom";
import { shouldCap } from "./shared/cap";
import { shouldReceive } from "./shared/receive";

describe("ERC20Simple", function () {
  let erc20Instance: ERC20Simple;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
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
});

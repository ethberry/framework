import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ERC20Simple } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE, tokenName, tokenSymbol } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";

describe("ERC20Simple", function () {
  let erc20: ContractFactory;
  let erc20Instance: ERC20Simple;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20Simple");
    [this.owner] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount)) as ERC20Simple;

    this.contractInstance = erc20Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
});

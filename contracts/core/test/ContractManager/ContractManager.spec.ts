import { use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";

import { ContractManager } from "../../typechain-types";
import { DEFAULT_ADMIN_ROLE } from "../constants";
import { shouldHaveRole } from "../shared/accessible/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessible/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessible/grantRole";
import { shouldRevokeRole } from "../shared/accessible/revokeRole";
import { shouldRenounceRole } from "../shared/accessible/renounceRole";

use(solidity);

describe("ContractManager", function () {
  let manager: ContractFactory;
  let managerInstance: ContractManager;

  beforeEach(async function () {
    manager = await ethers.getContractFactory("ContractManager");
    [this.owner, this.receiver] = await ethers.getSigners();

    managerInstance = (await manager.deploy()) as ContractManager;

    this.contractInstance = managerInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
});

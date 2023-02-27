import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";

import { deployContractManager } from "./fixture";

describe("ContractManager", function () {
  const factory = () => deployContractManager(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);

  it("should fail: wrong role", async function () {
    const [_owner, receiver] = await ethers.getSigners();
    const contractInstance = await factory();
    const tx = contractInstance.connect(receiver).destroy();
    await expect(tx).to.be.revertedWith(
      `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
    );
  });

  it("should destroy", async function () {
    const contractInstance = await factory();
    const tx = await contractInstance.destroy();
    await expect(tx).not.to.be.reverted;
  });
});

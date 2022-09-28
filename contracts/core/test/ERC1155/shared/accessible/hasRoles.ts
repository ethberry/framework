import { ethers } from "hardhat";
import { expect } from "chai";

import { deployErc1155Base } from "../fixtures";

export function shouldHaveRole(name: string) {
  return (...roles: Array<string>) => {
    describe("hasRole", function () {
      roles.forEach(role => {
        it(`Should set ${role} to deployer`, async function () {
          const [owner] = await ethers.getSigners();
          const { contractInstance } = await deployErc1155Base(name);
          const hasRole = await contractInstance.hasRole(role, owner.address);
          expect(hasRole).to.equal(true);
        });
      });
    });
  };
}

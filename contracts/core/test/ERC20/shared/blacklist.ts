import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

export function shouldTransfer(factory: () => Promise<Contract>) {
  describe("Black list", function () {
    it("should fail to transfer to blacklisted", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.transfer(receiver.address, amount);
      await expect(tx).to.be.revertedWith("Blacklist: receiver is blacklisted");
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { templateId } from "../../constants";

export function shouldBlacklist(factory: () => Promise<Contract>) {
  describe("Black list", function () {
    it("should fail: blacklisted", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.mintCommon(receiver.address, templateId);
      await expect(tx).to.be.revertedWith(`Blacklist: receiver is blacklisted`);
    });
  });
}

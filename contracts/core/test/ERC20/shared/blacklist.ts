import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";

export function shouldCustomBlackList(factory: () => Promise<Contract>) {
  describe("Black list", function () {
    it("should fail: transfer from", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(receiver.address, amount);
      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.connect(receiver).transfer(owner.address, amount);
      await expect(tx).to.be.revertedWith("Blacklist: sender is blacklisted");
    });

    it("should fail: transfer to", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.transfer(receiver.address, amount);
      await expect(tx).to.be.revertedWith("Blacklist: receiver is blacklisted");
    });

    it("should fail: mint", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.blacklist(receiver.address);
      const tx = contractInstance.mint(receiver.address, amount);
      await expect(tx).to.be.revertedWith("Blacklist: receiver is blacklisted");
    });

    it("should fail: transferFrom", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(receiver.address, amount);
      await contractInstance.blacklist(receiver.address);
      await contractInstance.connect(receiver).approve(owner.address, amount);

      const tx = contractInstance.transferFrom(receiver.address, owner.address, amount);
      await expect(tx).to.be.revertedWith("Blacklist: sender is blacklisted");
    });

    it("should fail: burn", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(receiver.address, amount);
      await contractInstance.blacklist(receiver.address);

      const tx = contractInstance.connect(receiver).burn(amount);
      await expect(tx).to.be.revertedWith("Blacklist: sender is blacklisted");
    });

    it("should fail: burnFrom", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mint(receiver.address, amount);
      await contractInstance.blacklist(receiver.address);
      await contractInstance.connect(receiver).approve(owner.address, amount);

      const tx = contractInstance.burnFrom(receiver.address, amount);
      await expect(tx).to.be.revertedWith("Blacklist: sender is blacklisted");
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";

import { amount } from "../../constants";

export function shouldTransferFrom() {
  describe("transferFrom", function () {
    it("should transfer", async function () {
      await this.contractInstance.mint(this.owner.address, amount);
      await this.contractInstance.approve(this.receiver.address, amount);

      const tx = this.contractInstance
        .connect(this.receiver)
        .transferFrom(this.owner.address, this.receiver.address, amount);
      await expect(tx)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, this.receiver.address, amount);

      const receiverBalance = await this.contractInstance.balanceOf(this.receiver.address);
      expect(receiverBalance).to.equal(amount);
      const balanceOfOwner = await this.contractInstance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should transfer to contract", async function () {
      await this.contractInstance.mint(this.owner.address, amount);
      await this.contractInstance.approve(this.receiver.address, amount);

      const tx = this.contractInstance
        .connect(this.receiver)
        .transferFrom(this.owner.address, this.erc20NonReceiverInstance.address, amount);
      await expect(tx)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, this.erc20NonReceiverInstance.address, amount);

      const nonReceiverBalance = await this.contractInstance.balanceOf(this.erc20NonReceiverInstance.address);
      expect(nonReceiverBalance).to.equal(amount);
      const balanceOfOwner = await this.contractInstance.balanceOf(this.owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should fail: double transfer, amount exceeds allowance", async function () {
      await this.contractInstance.mint(this.owner.address, amount);
      await this.contractInstance.approve(this.receiver.address, amount);

      const tx = this.contractInstance
        .connect(this.receiver)
        .transferFrom(this.owner.address, this.receiver.address, amount);
      await expect(tx)
        .to.emit(this.contractInstance, "Transfer")
        .withArgs(this.owner.address, this.receiver.address, amount);

      const tx1 = this.contractInstance
        .connect(this.receiver)
        .transferFrom(this.owner.address, this.receiver.address, amount);
      await expect(tx1).to.be.revertedWith(`ERC20: insufficient allowance`);
    });

    it("should fail: transfer to the zero address", async function () {
      await this.contractInstance.mint(this.owner.address, amount);
      await this.contractInstance.approve(this.receiver.address, amount);
      const tx = this.contractInstance
        .connect(this.receiver)
        .transferFrom(this.owner.address, ethers.constants.AddressZero, amount);
      await expect(tx).to.be.revertedWith(`ERC20: transfer to the zero address`);
    });

    it("should fail: transfer amount exceeds balance", async function () {
      await this.contractInstance.approve(this.receiver.address, amount);
      const tx = this.contractInstance
        .connect(this.receiver)
        .transferFrom(this.owner.address, this.receiver.address, amount);
      await expect(tx).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
    });

    it("should fail: transfer amount exceeds allowance", async function () {
      await this.contractInstance.mint(this.owner.address, amount);
      const tx = this.contractInstance
        .connect(this.receiver)
        .transferFrom(this.owner.address, this.receiver.address, amount);
      await expect(tx).to.be.revertedWith(`ERC20: insufficient allowance`);
    });
  });
}

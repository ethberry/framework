import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { amount } from "@gemunion/contracts-constants";
import { deployJerk } from "@gemunion/contracts-mocks";
import { defaultMintERC20 } from "@gemunion/contracts-erc20";
import type { IERC20Options } from "@gemunion/contracts-erc20";

export function shouldTransfer(factory: () => Promise<Contract>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;

  describe("transfer", function () {
    it("should fail: transfer amount exceeds balance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, 0);

      const tx1 = contractInstance.whitelist(receiver.address);
      await expect(tx1).to.emit(contractInstance, "Whitelisted").withArgs(receiver.address);

      const tx2 = contractInstance.transfer(receiver.address, amount);
      await expect(tx2).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should transfer", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const tx1 = contractInstance.whitelist(receiver.address);
      await expect(tx1).to.emit(contractInstance, "Whitelisted").withArgs(receiver.address);

      const tx2 = contractInstance.transfer(receiver.address, amount);
      await expect(tx2).to.emit(contractInstance, "Transfer").withArgs(owner.address, receiver.address, amount);

      const receiverBalance = await contractInstance.balanceOf(receiver.address);
      expect(receiverBalance).to.equal(amount);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should transfer to contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc20NonReceiverInstance = await deployJerk();

      await mint(contractInstance, owner, owner.address);

      const tx1 = contractInstance.whitelist(erc20NonReceiverInstance.address);
      await expect(tx1).to.emit(contractInstance, "Whitelisted").withArgs(erc20NonReceiverInstance.address);

      const tx2 = contractInstance.transfer(erc20NonReceiverInstance.address, amount);
      await expect(tx2)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, erc20NonReceiverInstance.address, amount);

      const nonReceiverBalance = await contractInstance.balanceOf(erc20NonReceiverInstance.address);
      expect(nonReceiverBalance).to.equal(amount);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });
  });
}

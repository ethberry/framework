import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";
import { deployJerk } from "@gemunion/contracts-mocks";
import type { IERC20Options } from "@gemunion/contracts-erc20";
import { defaultMintERC20 } from "@gemunion/contracts-erc20";

export function shouldTransferFrom(factory: () => Promise<any>, options: IERC20Options = {}) {
  const { mint = defaultMintERC20 } = options;

  describe("transferFrom", function () {
    it("should transfer", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, amount);

      const tx1 = contractInstance.whitelist(receiver.address);
      await expect(tx1).to.emit(contractInstance, "Whitelisted").withArgs(receiver.address);

      const tx2 = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx2).to.emit(contractInstance, "Transfer").withArgs(owner.address, receiver.address, amount);

      const receiverBalance = await contractInstance.balanceOf(receiver.address);
      expect(receiverBalance).to.equal(amount);
      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should transfer to contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc20NonReceiverInstance = await deployJerk();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, amount);

      const tx1 = contractInstance.whitelist(await erc20NonReceiverInstance.getAddress());
      await expect(tx1)
        .to.emit(contractInstance, "Whitelisted")
        .withArgs(await erc20NonReceiverInstance.getAddress());

      const tx2 = contractInstance
        .connect(receiver)
        .transferFrom(owner.address, await erc20NonReceiverInstance.getAddress(), amount);
      await expect(tx2)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, await erc20NonReceiverInstance.getAddress(), amount);

      const nonReceiverBalance = await contractInstance.balanceOf(await erc20NonReceiverInstance.getAddress());
      expect(nonReceiverBalance).to.equal(amount);
      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);
    });

    it("should fail: double transfer, amount exceeds allowance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, amount);

      const tx1 = contractInstance.whitelist(receiver.address);
      await expect(tx1).to.emit(contractInstance, "Whitelisted").withArgs(receiver.address);

      const tx2 = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx2).to.emit(contractInstance, "Transfer").withArgs(owner.address, receiver.address, amount);

      const tx3 = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx3).to.be.revertedWith(`ERC20: insufficient allowance`);
    });

    it("should fail: transfer to the zero address", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      await contractInstance.approve(receiver.address, amount);
      const tx = contractInstance.connect(receiver).transferFrom(owner.address, ZeroAddress, amount);
      await expect(tx).to.be.revertedWith(`ERC20: transfer to the zero address`);
    });

    it("should fail: transfer amount exceeds balance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address, 0);
      await contractInstance.approve(receiver.address, amount);

      const tx1 = contractInstance.whitelist(receiver.address);
      await expect(tx1).to.emit(contractInstance, "Whitelisted").withArgs(receiver.address);

      const tx2 = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx2).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
    });

    it("should fail: transfer amount exceeds allowance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);
      const tx = contractInstance.connect(receiver).transferFrom(owner.address, receiver.address, amount);
      await expect(tx).to.be.revertedWith(`ERC20: insufficient allowance`);
    });
  });
}

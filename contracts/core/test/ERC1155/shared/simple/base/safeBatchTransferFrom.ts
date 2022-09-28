import { expect } from "chai";
import { ethers } from "hardhat";

import { amount, tokenId } from "../../../../constants";
import { deployErc1155Base, deployErc1155NonReceiver, deployErc1155Receiver } from "../../fixtures";

export function shouldSafeBatchTransferFrom(name: string) {
  describe("safeBatchTransferFrom", function () {
    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);
      const { contractInstance: erc1155ReceiverInstance } = await deployErc1155Receiver();

      const tokenId_1 = 2;
      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      await contractInstance.mint(owner.address, tokenId_1, amount, "0x");
      const tx = contractInstance.safeBatchTransferFrom(
        owner.address,
        erc1155ReceiverInstance.address,
        [tokenId, tokenId_1],
        [amount, amount],
        "0x",
      );
      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(
          owner.address,
          owner.address,
          erc1155ReceiverInstance.address,
          [tokenId, tokenId_1],
          [amount, amount],
        );

      const balanceOfOwner1 = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner1).to.equal(0);
      const balanceOfOwner2 = await contractInstance.balanceOf(owner.address, tokenId_1);
      expect(balanceOfOwner2).to.equal(0);

      const balanceOfReceiver1 = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver1).to.equal(amount);
      const balanceOfReceiver2 = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver2).to.equal(amount);
    });

    it("should fail: transfer to non ERC1155Receiver implementer", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);
      const { contractInstance: erc1155NonReceiverInstance } = await deployErc1155NonReceiver();

      const tokenId_1 = 2;
      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      await contractInstance.mint(owner.address, tokenId_1, amount, "0x");
      const tx = contractInstance.safeBatchTransferFrom(
        owner.address,
        erc1155NonReceiverInstance.address,
        [tokenId, tokenId_1],
        [amount, amount],
        "0x",
      );
      await expect(tx).to.be.revertedWith(`ERC1155: transfer to non ERC1155Receiver implementer`);
    });

    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);
      const { contractInstance: erc1155ReceiverInstance } = await deployErc1155Receiver();

      const tokenId_1 = 2;
      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      await contractInstance.mint(owner.address, tokenId_1, amount, "0x");
      const tx = contractInstance
        .connect(receiver)
        .safeBatchTransferFrom(
          owner.address,
          erc1155ReceiverInstance.address,
          [tokenId, tokenId_1],
          [amount, amount],
          "0x",
        );
      await expect(tx).to.be.revertedWith(`ERC1155: caller is not token owner nor approved`);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);
      const { contractInstance: erc1155ReceiverInstance } = await deployErc1155Receiver();

      const tokenId_1 = 2;
      await contractInstance.mint(owner.address, tokenId, amount, "0x");
      await contractInstance.mint(owner.address, tokenId_1, amount, "0x");
      contractInstance.setApprovalForAll(receiver.address, true);

      const tx = contractInstance
        .connect(receiver)
        .safeBatchTransferFrom(
          owner.address,
          erc1155ReceiverInstance.address,
          [tokenId, tokenId_1],
          [amount, amount],
          "0x",
        );
      await expect(tx)
        .to.emit(contractInstance, "TransferBatch")
        .withArgs(
          receiver.address,
          owner.address,
          erc1155ReceiverInstance.address,
          [tokenId, tokenId_1],
          [amount, amount],
        );

      const balanceOfOwner1 = await contractInstance.balanceOf(owner.address, tokenId);
      expect(balanceOfOwner1).to.equal(0);
      const balanceOfOwner2 = await contractInstance.balanceOf(owner.address, tokenId_1);
      expect(balanceOfOwner2).to.equal(0);

      const balanceOfReceiver1 = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver1).to.equal(amount);
      const balanceOfReceiver2 = await contractInstance.balanceOf(erc1155ReceiverInstance.address, tokenId);
      expect(balanceOfReceiver2).to.equal(amount);
    });
  });
}

import { expect } from "chai";
import { ethers } from "hardhat";

import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";
import { batchSize } from "@gemunion/contracts-constants";

import { tokenId } from "../../../../../constants";

export function shouldSafeTransferFrom(factory: () => Promise<any>) {
  describe("safeTransferFrom", function () {
    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      await contractInstance.mintCommon(owner.address, batchSize + tokenId);
      const tx = contractInstance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, receiver.address, batchSize + tokenId);

      await expect(tx).to.be.revertedWith(`ERC721: caller is not token owner or approved`);
    });

    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721ReceiverInstance = await deployWallet();

      await contractInstance.mintCommon(owner.address, batchSize + tokenId);
      const tx = contractInstance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        await erc721ReceiverInstance.getAddress(),
        batchSize + tokenId,
      );

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, await erc721ReceiverInstance.getAddress(), batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(batchSize);

      const balanceOfReceiver = await contractInstance.balanceOf(await erc721ReceiverInstance.getAddress());
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer own tokens to non receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721NonReceiverInstance = await deployJerk();

      await contractInstance.mintCommon(owner.address, batchSize + tokenId);
      const tx = contractInstance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        await erc721NonReceiverInstance.getAddress(),
        batchSize + tokenId,
      );
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721ReceiverInstance = await deployWallet();

      await contractInstance.mintCommon(owner.address, batchSize + tokenId);
      await contractInstance.approve(receiver.address, batchSize + tokenId);

      const tx = contractInstance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](
          owner.address,
          await erc721ReceiverInstance.getAddress(),
          batchSize + tokenId,
        );

      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(owner.address, await erc721ReceiverInstance.getAddress(), batchSize + tokenId);

      const balanceOfOwner = await contractInstance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(batchSize);

      const balanceOfReceiver = await contractInstance.balanceOf(await erc721ReceiverInstance.getAddress());
      expect(balanceOfReceiver).to.equal(1);
    });

    it("should transfer approved tokens to non receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721NonReceiverInstance = await deployJerk();

      await contractInstance.mintCommon(owner.address, batchSize + tokenId);
      await contractInstance.approve(receiver.address, batchSize + tokenId);

      const tx = contractInstance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](
          owner.address,
          await erc721NonReceiverInstance.getAddress(),
          batchSize + tokenId,
        );
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });
  });
}

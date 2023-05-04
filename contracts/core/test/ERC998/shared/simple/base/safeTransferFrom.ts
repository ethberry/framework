import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { InterfaceId } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

import { deployERC721 } from "../../../../ERC721/shared/fixtures";
import { templateId, tokenId } from "../../../../constants";

export function shouldSafeTransferFrom(factory: () => Promise<Contract>) {
  describe("safeTransferFrom", function () {
    it("should fail: not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const erc721Instance = await factory();

      await erc721Instance.mintCommon(owner.address, templateId);
      const tx = erc721Instance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, receiver.address, 1);

      await expect(tx).to.be.revertedWith(`ERC721: caller is not token owner or approved`);
    });

    it("should fail: burned token", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();

      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.mintCommon(owner.address, templateId);

      await erc721Instance.burn(tokenId);

      const tx = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        tokenId,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx).to.be.revertedWith(`ERC721: invalid token ID`);
    });

    it("should fail: receiver is burned", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();

      const supportsWhiteListChild = await erc721Instance.supportsInterface(InterfaceId.IERC998WL);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721Instance.address, 0);
      }

      await erc721Instance.mintCommon(owner.address, templateId);

      await erc721Instance.burn(tokenId);

      const tx = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        tokenId,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx).to.be.revertedWith(`ERC721: invalid token ID`);
    });

    it("should transfer own tokens to receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721ReceiverInstance = await deployWallet();

      await erc721Instance.mintCommon(owner.address, templateId);
      const tx = erc721Instance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        erc721ReceiverInstance.address,
        tokenId,
      );

      await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(owner.address, erc721ReceiverInstance.address, 1);

      const balanceOfOwner = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await erc721Instance.balanceOf(erc721ReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await erc721Instance.tokenOfOwnerByIndex(erc721ReceiverInstance.address, 0); // 0 is nft index
      expect(item).to.equal(0); // 0 is nft index
    });

    it("should not transfer own tokens to non receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721NonReceiverInstance = await deployJerk();

      await erc721Instance.mintCommon(owner.address, templateId);
      const tx = erc721Instance["safeTransferFrom(address,address,uint256)"](
        owner.address,
        erc721NonReceiverInstance.address,
        tokenId,
      );
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should transfer approved tokens to receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721ReceiverInstance = await deployWallet();

      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.approve(receiver.address, tokenId);

      const tx = erc721Instance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, erc721ReceiverInstance.address, tokenId);

      await expect(tx)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(owner.address, erc721ReceiverInstance.address, tokenId);

      const balanceOfOwner = await erc721Instance.balanceOf(owner.address);
      expect(balanceOfOwner).to.equal(0);

      const balanceOfReceiver = await erc721Instance.balanceOf(erc721ReceiverInstance.address);
      expect(balanceOfReceiver).to.equal(1);

      const item = await erc721Instance.tokenOfOwnerByIndex(erc721ReceiverInstance.address, 0);
      expect(item).to.equal(0); // 0 is nft index
    });

    it("should not transfer approved tokens to non receiver contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721NonReceiverInstance = await deployJerk();

      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.approve(receiver.address, tokenId);

      const tx = erc721Instance
        .connect(receiver)
        ["safeTransferFrom(address,address,uint256)"](owner.address, erc721NonReceiverInstance.address, tokenId);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });

    it("should transfer token to another token", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721InstanceMock = await deployERC721("ERC721Simple");

      const supportsWhiteListChild = await erc721Instance.supportsInterface(InterfaceId.IERC998WL);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721InstanceMock.address, 0);
      }

      await erc721InstanceMock.mintCommon(owner.address, templateId);
      await erc721Instance.mintCommon(owner.address, templateId); // this is edge case
      await erc721Instance.mintCommon(owner.address, templateId);

      const tx1 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        tokenId,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx1)
        .to.emit(erc721Instance, "ReceivedChild")
        .withArgs(owner.address, 1, erc721InstanceMock.address, tokenId, 1);
      await expect(tx1)
        .to.emit(erc721InstanceMock, "Transfer")
        .withArgs(owner.address, erc721Instance.address, tokenId);

      const balanceOfOwner = await erc721InstanceMock.balanceOf(erc721Instance.address);
      expect(balanceOfOwner).to.equal(1);

      // TODO "CTD: _transferFrom token is child of other top down composable"
    });

    it("should not transfer token to itself", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();

      const supportsWhiteListChild = await erc721Instance.supportsInterface(InterfaceId.IERC998WL);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721Instance.address, 0);
      }

      await erc721Instance.mintCommon(owner.address, templateId); // this is edge case
      await erc721Instance.mintCommon(owner.address, templateId);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        1,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx1).to.be.revertedWith(`CTD: circular ownership is forbidden`);
    });

    it("should transfer tree of tokens to wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const erc721Instance = await factory();

      const supportsWhiteListChild = await erc721Instance.supportsInterface(InterfaceId.IERC998WL);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721Instance.address, 0);
      }

      await erc721Instance.mintCommon(owner.address, templateId); // this is edge case
      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.mintCommon(owner.address, templateId);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        3,
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        2,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx2).to.not.be.reverted;

      const tx3 = erc721Instance["safeTransferFrom(address,address,uint256)"](owner.address, receiver.address, 4);
      await expect(tx3).to.not.be.reverted;

      const balance = await erc721Instance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });

    it("should not transfer token from the middle of the tree", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const erc721Instance = await factory();

      const supportsWhiteListChild = await erc721Instance.supportsInterface(InterfaceId.IERC998WL);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721Instance.address, 0);
      }

      await erc721Instance.mintCommon(owner.address, templateId); // this is edge case
      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.mintCommon(owner.address, templateId);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        3,
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        2,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx2).to.not.be.reverted;

      const tx3 = erc721Instance["safeTransferFrom(address,address,uint256)"](owner.address, receiver.address, 2);
      // DOUBLE CHECK
      await expect(tx3).to.be.revertedWith(`ERC721: caller is not token owner or approved`);
    });

    it("should not transfer token to its child token", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();

      const supportsWhiteListChild = await erc721Instance.supportsInterface(InterfaceId.IERC998WL);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721Instance.address, 0);
      }

      await erc721Instance.mintCommon(owner.address, templateId); // this is edge case
      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.mintCommon(owner.address, templateId);

      const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        1,
        "0x0000000000000000000000000000000000000000000000000000000000000002",
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        2,
        "0x0000000000000000000000000000000000000000000000000000000000000001",
      );
      await expect(tx2).to.be.revertedWith(`CTD: circular ownership is forbidden`);
    });
  });
}

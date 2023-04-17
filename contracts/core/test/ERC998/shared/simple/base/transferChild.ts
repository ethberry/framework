import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { InterfaceId } from "@gemunion/contracts-constants";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";

import { deployERC721 } from "../../../../ERC721/shared/fixtures";
import { templateId } from "../../../../constants";

export function shouldTransferChild(factory: () => Promise<Contract>) {
  describe("transferChild", function () {
    it("should transfer token owned by another token to wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
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
        1, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc721Instance.transferChild(1, receiver.address, erc721InstanceMock.address, 1);
      await expect(tx2)
        .to.emit(erc721Instance, "TransferChild")
        .withArgs(1, receiver.address, erc721InstanceMock.address, 1, 1);
    });

    it("should transfer token owned by another token to the receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721InstanceMock = await deployERC721("ERC721Simple");
      const erc721ReceiverInstance = await deployWallet();

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
        1, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc721Instance.transferChild(1, erc721ReceiverInstance.address, erc721InstanceMock.address, 1);
      await expect(tx2)
        .to.emit(erc721Instance, "TransferChild")
        .withArgs(1, erc721ReceiverInstance.address, erc721InstanceMock.address, 1, 1);
    });

    it("should transfer token owned by another token to the non receiver contract", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721InstanceMock = await deployERC721("ERC721Simple");
      const erc721NonReceiverInstance = await deployJerk();

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
        1, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc721Instance.transferChild(1, erc721NonReceiverInstance.address, erc721InstanceMock.address, 1);
      await expect(tx2)
        .to.emit(erc721Instance, "TransferChild")
        .withArgs(1, erc721NonReceiverInstance.address, erc721InstanceMock.address, 1, 1);
    });

    it("should fail: transfer token which is not owned", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721InstanceMock = await deployERC721("ERC721Simple");

      const supportsWhiteListChild = await erc721Instance.supportsInterface(InterfaceId.IERC998WL);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721InstanceMock.address, 0);
      }

      await erc721InstanceMock.mintCommon(owner.address, templateId);
      await erc721Instance.mintCommon(owner.address, templateId); // this is edge case
      await erc721Instance.mintCommon(owner.address, templateId);

      const tx = erc721Instance.transferChild(1, receiver.address, erc721InstanceMock.address, 1);

      await expect(tx).to.be.revertedWith(`CTD: _transferChild _childContract _childTokenId not found`);
    });

    it("should transfer 998 token owned by another token to the wallet", async function () {
      const [owner, receiver] = await ethers.getSigners();
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
        1, // erc998 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000002", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      const tx2 = erc721Instance.transferChild(2, receiver.address, erc721Instance.address, 1);
      await expect(tx2)
        .to.emit(erc721Instance, "TransferChild")
        .withArgs(2, receiver.address, erc721Instance.address, 1, 1);
    });
  });
}

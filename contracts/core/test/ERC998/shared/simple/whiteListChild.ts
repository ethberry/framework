import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE } from "@gemunion/contracts-constants";

import { deployERC721 } from "../../../ERC721/shared/fixtures";

export function shouldBehaveLikeERC998WhiteListChild(factory: () => Promise<any>) {
  describe("WhiteListChild", function () {
    describe("isWhitelisted", function () {
      it("should not in whiteListChild", async function () {
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        const tx1 = await erc721Instance.isWhitelisted(await erc721InstanceMock.getAddress());
        expect(tx1).to.equal(false);
      });
    });

    describe("whiteListChild", function () {
      it("should add to whiteListChild", async function () {
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        const tx1 = erc721Instance.whiteListChild(await erc721InstanceMock.getAddress(), 0);
        await expect(tx1)
          .to.emit(erc721Instance, "WhitelistedChild")
          .withArgs(await erc721InstanceMock.getAddress(), 0);

        const isWhitelisted = await erc721Instance.isWhitelisted(await erc721InstanceMock.getAddress());
        expect(isWhitelisted).to.equal(true);
      });

      it("should fail: account is missing role", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        const tx = erc721Instance.connect(receiver).whiteListChild(await erc721InstanceMock.getAddress(), 0);
        await expect(tx).to.be.revertedWith(
          `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
        );
      });
    });

    describe("unWhitelistChild", function () {
      it("should remove from whitelist", async function () {
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        const tx1 = erc721Instance.whiteListChild(await erc721InstanceMock.getAddress(), 0);
        await expect(tx1)
          .to.emit(erc721Instance, "WhitelistedChild")
          .withArgs(await erc721InstanceMock.getAddress(), 0);

        const isWhitelisted1 = await erc721Instance.isWhitelisted(await erc721InstanceMock.getAddress());
        expect(isWhitelisted1).to.equal(true);

        const tx2 = erc721Instance.unWhitelistChild(await erc721InstanceMock.getAddress());
        await expect(tx2)
          .to.emit(erc721Instance, "UnWhitelistedChild")
          .withArgs(await erc721InstanceMock.getAddress());

        const isWhitelisted2 = await erc721Instance.isWhitelisted(await erc721InstanceMock.getAddress());
        expect(isWhitelisted2).to.equal(false);
      });

      it("should fail: account is missing role", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        await erc721Instance.whiteListChild(await erc721InstanceMock.getAddress(), 0);
        const tx1 = await erc721Instance.isWhitelisted(await erc721InstanceMock.getAddress());
        expect(tx1).to.equal(true);

        const tx = erc721Instance.connect(receiver).unWhitelistChild(await erc721InstanceMock.getAddress());
        await expect(tx).to.be.revertedWith(
          `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
        );
      });
    });

    describe("getMaxChild", function () {
      describe("getMaxChild", function () {
        it("should get max child", async function () {
          const erc721Instance = await factory();
          const erc721InstanceMock = await deployERC721("ERC721ABEC");

          const maxChild = await erc721Instance.getMaxChild(await erc721InstanceMock.getAddress());
          expect(maxChild).to.equal(0);
        });
      });
    });

    describe("setDefaultMaxChild", function () {
      it("should set max child", async function () {
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        const max = 10;
        const tx1 = await erc721Instance.setDefaultMaxChild(max);
        await expect(tx1).to.emit(erc721Instance, "SetMaxChild").withArgs(ethers.ZeroAddress, max);

        const maxChild = await erc721Instance.getMaxChild(await erc721InstanceMock.getAddress());
        expect(maxChild).to.equal(max);
      });

      it("should fail: account is missing role", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const erc721Instance = await factory();

        const tx = erc721Instance.connect(receiver).setDefaultMaxChild(0);
        await expect(tx).to.be.revertedWith(
          `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
        );
      });
    });

    describe("setMaxChild", function () {
      it("should set max child", async function () {
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        const max = 10;
        const tx1 = await erc721Instance.setMaxChild(await erc721InstanceMock.getAddress(), max);
        await expect(tx1)
          .to.emit(erc721Instance, "SetMaxChild")
          .withArgs(await erc721InstanceMock.getAddress(), max);

        const maxChild = await erc721Instance.getMaxChild(await erc721InstanceMock.getAddress());
        expect(maxChild).to.equal(max);
      });

      it("should fail: account is missing role", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        const tx = erc721Instance.connect(receiver).setMaxChild(await erc721InstanceMock.getAddress(), 0);
        await expect(tx).to.be.revertedWith(
          `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
        );
      });
    });

    describe("getChildCount", function () {
      it("should increment while safeTransferFrom", async function () {
        const [owner] = await ethers.getSigners();
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        await erc721Instance.whiteListChild(await erc721InstanceMock.getAddress(), 0);
        await erc721Instance.setDefaultMaxChild(0); // unlimited
        await erc721InstanceMock.mint(owner.address);
        await erc721Instance.mint(owner.address); // this is edge case
        await erc721Instance.mint(owner.address);

        const tx1 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
          owner.address,
          await erc721Instance.getAddress(),
          0, // erc721 tokenId
          "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
        );
        await expect(tx1).to.not.be.reverted;

        const tx2 = await erc721Instance.getChildCount(await erc721InstanceMock.getAddress());
        expect(tx2).to.equal(1);
      });
    });

    describe("incrementChildCount/decrementChildCount", function () {
      it("should make increment for safeTransferFrom", async function () {
        const [owner] = await ethers.getSigners();
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        await erc721Instance.whiteListChild(await erc721InstanceMock.getAddress(), 0);
        await erc721Instance.setDefaultMaxChild(0);
        await erc721InstanceMock.mint(owner.address);
        await erc721InstanceMock.mint(owner.address);
        await erc721Instance.mint(owner.address); // this is edge case
        await erc721Instance.mint(owner.address);

        const tx1 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
          owner.address,
          await erc721Instance.getAddress(),
          0, // erc721 tokenId
          "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
        );
        await expect(tx1).to.not.be.reverted;

        const tx2 = await erc721Instance.getChildCount(await erc721InstanceMock.getAddress());
        expect(tx2).to.equal(1);

        const tx3 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
          owner.address,
          await erc721Instance.getAddress(),
          1, // erc721 tokenId
          "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
        );
        await expect(tx3).to.not.be.reverted;

        const tx4 = await erc721Instance.getChildCount(await erc721InstanceMock.getAddress());
        expect(tx4).to.equal(2);
      });

      it("should make increment/decriment for safeTransferFrom", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        await erc721Instance.whiteListChild(await erc721InstanceMock.getAddress(), 0);
        await erc721Instance.setDefaultMaxChild(0);
        await erc721InstanceMock.mint(owner.address);
        await erc721InstanceMock.mint(owner.address);
        await erc721Instance.mint(owner.address); // this is edge case
        await erc721Instance.mint(owner.address);

        const tx1 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
          owner.address,
          await erc721Instance.getAddress(),
          0, // erc721 tokenId
          "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
        );
        await expect(tx1).to.not.be.reverted;

        const tx2 = await erc721Instance.getChildCount(await erc721InstanceMock.getAddress());
        expect(tx2).to.equal(1);

        const tx3 = erc721Instance["safeTransferChild(uint256,address,address,uint256)"](
          1,
          receiver.address,
          await erc721InstanceMock.getAddress(),
          0,
        );
        await expect(tx3)
          .to.emit(erc721Instance, "TransferChild")
          .withArgs(1, receiver.address, await erc721InstanceMock.getAddress(), 0, 1);

        const tx4 = await erc721Instance.getChildCount(await erc721InstanceMock.getAddress());
        expect(tx4).to.equal(0);
      });

      it("should fail with excess number for safeTransferFrom", async function () {
        const [owner] = await ethers.getSigners();
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        await erc721Instance.whiteListChild(await erc721InstanceMock.getAddress(), 0);
        await erc721Instance.setDefaultMaxChild(1);
        await erc721InstanceMock.mint(owner.address);
        await erc721InstanceMock.mint(owner.address);
        await erc721Instance.mint(owner.address); // this is edge case
        await erc721Instance.mint(owner.address);

        const tx1 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
          owner.address,
          await erc721Instance.getAddress(),
          0, // erc721 tokenId
          "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
        );
        await expect(tx1).to.not.be.reverted;

        const tx2 = await erc721Instance.getChildCount(await erc721InstanceMock.getAddress());
        expect(tx2).to.equal(1);

        const tx3 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
          owner.address,
          await erc721Instance.getAddress(),
          1, // erc721 tokenId
          "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
        );
        await expect(tx3).to.be.revertedWith(`WhiteListChild: excess number of address`);
      });

      it("should make increment/decriment for safeTransferFrom and safeTransferChild", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const erc721Instance = await factory();
        const erc721InstanceMock = await deployERC721("ERC721ABEC");

        await erc721Instance.whiteListChild(await erc721InstanceMock.getAddress(), 0);
        await erc721Instance.setDefaultMaxChild(0);
        await erc721InstanceMock.mint(owner.address);
        await erc721Instance.mint(owner.address); // this is edge case
        await erc721Instance.mint(owner.address);

        const tx1 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
          owner.address,
          await erc721Instance.getAddress(),
          0, // erc721 tokenId
          "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
        );
        await expect(tx1).to.not.be.reverted;

        const tx2 = await erc721Instance.getChildCount(await erc721InstanceMock.getAddress());
        expect(tx2).to.equal(1);

        const tx3 = erc721Instance["safeTransferChild(uint256,address,address,uint256)"](
          1,
          receiver.address,
          await erc721InstanceMock.getAddress(),
          0,
        );
        await expect(tx3)
          .to.emit(erc721Instance, "TransferChild")
          .withArgs(1, receiver.address, await erc721InstanceMock.getAddress(), 0, 1);

        const tx4 = await erc721Instance.getChildCount(await erc721InstanceMock.getAddress());
        expect(tx4).to.equal(0);
      });

      it("should make increment/decriment for safeTransferFrom and transferChild", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const erc721Instance = await factory();

        await erc721Instance.whiteListChild(await erc721Instance.getAddress(), 0);
        await erc721Instance.setDefaultMaxChild(0);
        await erc721Instance.mint(owner.address); // this is edge case
        await erc721Instance.mint(owner.address);
        await erc721Instance.mint(owner.address);

        const tx1 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
          owner.address,
          await erc721Instance.getAddress(),
          1, // erc998 tokenId
          "0x0000000000000000000000000000000000000000000000000000000000000002", // erc998 tokenId
        );
        await expect(tx1).to.not.be.reverted;

        const tx2 = await erc721Instance.getChildCount(await erc721Instance.getAddress());
        expect(tx2).to.equal(1);

        const tx3 = erc721Instance.transferChild(2, receiver.address, await erc721Instance.getAddress(), 1);
        await expect(tx3)
          .to.emit(erc721Instance, "TransferChild")
          .withArgs(2, receiver.address, await erc721Instance.getAddress(), 1, 1);

        const tx4 = await erc721Instance.getChildCount(await erc721Instance.getAddress());
        expect(tx4).to.equal(0);
      });
    });
  });
}

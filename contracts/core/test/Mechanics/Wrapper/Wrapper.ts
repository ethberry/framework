import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";

import { deployERC20 } from "../../ERC20/shared/fixtures";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { deployERC1155 } from "../../ERC1155/shared/fixtures";
import { shouldBehaveLikeERC721Simple } from "../../ERC721/shared/simple";
import { deployContract } from "../../shared/fixture";
import { templateId, tokenId } from "../../constants";

describe("Wrapper", function () {
  const factory = () => deployERC721("ERC721WrapperTest");
  const erc20Factory = (name: string) => deployERC20(name);
  const erc721Factory = (name: string) => deployERC721(name);
  const erc998Factory = (name: string) => deployERC721(name);
  const erc1155Factory = (name: string) => deployERC1155(name);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeERC721Simple(factory);

  describe("mint/unpack", function () {
    describe("NATIVE", function () {
      it("should mint/unpack NATIVE", async function () {
        const [owner] = await ethers.getSigners();

        const erc721WrapperInstance = await factory();

        const tx = erc721WrapperInstance.mintBox(
          owner.address,
          templateId,
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId: 0,
              amount,
            },
          ],
          { value: amount },
        );
        await expect(tx).to.changeEtherBalances([owner, erc721WrapperInstance], [-amount, amount]);

        const tx1 = erc721WrapperInstance.unpack(1);
        await expect(tx1).to.changeEtherBalances([owner, erc721WrapperInstance], [amount, -amount]);
      });
    });

    describe("ERC20", function () {
      it("should mint/unpack", async function () {
        const [owner] = await ethers.getSigners();

        const erc20Instance = await erc20Factory("ERC20Simple");
        const erc721WrapperInstance = await factory();

        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(erc721WrapperInstance.address, amount);

        const tx = erc721WrapperInstance.mintBox(owner.address, templateId, [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount,
          },
        ]);
        await expect(tx).to.emit(erc20Instance, "Transfer");
        await expect(tx).to.changeTokenBalances(erc20Instance, [owner, erc721WrapperInstance], [-amount, amount]);

        const tx1 = erc721WrapperInstance.unpack(1);
        await expect(tx1).to.emit(erc20Instance, "Transfer");
        await expect(tx1).to.changeTokenBalances(erc20Instance, [owner, erc721WrapperInstance], [amount, -amount]);
      });

      it("should mint/unpack (ERC1363) ", async function () {
        const [owner] = await ethers.getSigners();

        const erc20Instance = await erc20Factory("ERC20Simple");
        const erc721WrapperInstance = await factory();
        const walletMockInstance = await deployContract("WrapperMock");

        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(erc721WrapperInstance.address, amount);

        const tx = erc721WrapperInstance.mintBox(owner.address, templateId, [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount,
          },
        ]);
        await expect(tx).to.emit(erc20Instance, "Transfer");
        await expect(tx).to.changeTokenBalances(erc20Instance, [owner, erc721WrapperInstance], [-amount, amount]);
        await expect(tx)
          .to.emit(erc721WrapperInstance, "Transfer")
          .withArgs(constants.AddressZero, owner.address, tokenId);

        await erc721WrapperInstance.transferFrom(owner.address, walletMockInstance.address, 1);

        // Calling WrapperWalletMock.unpack
        const tx1 = walletMockInstance.unpack(erc721WrapperInstance.address, tokenId);
        await expect(tx1)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(erc721WrapperInstance.address, walletMockInstance.address, amount);
        await expect(tx1).to.emit(erc721WrapperInstance, "UnpackWrapper");
        await expect(tx1).to.emit(walletMockInstance, "TransferReceived");
        await expect(tx1).to.changeTokenBalances(
          erc20Instance,
          [walletMockInstance, erc721WrapperInstance],
          [amount, -amount],
        );
      });
    });

    describe("ERC721", function () {
      it("should mint/unpack", async function () {
        const [owner] = await ethers.getSigners();

        const erc721Instance = await erc721Factory("ERC721Simple");
        const erc721WrapperInstance = await factory();

        await erc721Instance.mintCommon(owner.address, 1);
        await erc721Instance.setApprovalForAll(erc721WrapperInstance.address, true);

        await erc721WrapperInstance.mintBox(owner.address, templateId, [
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 1,
            amount,
          },
        ]);
        const balanace = await erc721Instance.balanceOf(erc721WrapperInstance.address);
        expect(balanace).to.be.equal(1);

        await erc721WrapperInstance.unpack(1);
        const balanace2 = await erc721Instance.balanceOf(erc721WrapperInstance.address);
        expect(balanace2).to.be.equal(0);
      });
    });

    describe("ERC998", function () {
      it("should mint/unpack", async function () {
        const [owner] = await ethers.getSigners();

        const erc998Instance = await erc998Factory("ERC998Simple");
        const erc721WrapperInstance = await factory();

        await erc998Instance.mintCommon(owner.address, 1);
        await erc998Instance.setApprovalForAll(erc721WrapperInstance.address, true);

        await erc721WrapperInstance.mintBox(owner.address, templateId, [
          {
            tokenType: 3,
            token: erc998Instance.address,
            tokenId: 1,
            amount,
          },
        ]);
        const balanace = await erc998Instance.balanceOf(erc721WrapperInstance.address);
        expect(balanace).to.be.equal(1);

        await erc721WrapperInstance.unpack(1);
        const balanace2 = await erc998Instance.balanceOf(erc721WrapperInstance.address);
        expect(balanace2).to.be.equal(0);
      });
    });

    describe("ERC1155", function () {
      it("should mint/unpack", async function () {
        const [owner] = await ethers.getSigners();

        const erc1155Instance = await erc1155Factory("ERC1155Simple");
        const erc721WrapperInstance = await factory();

        await erc1155Instance.mint(owner.address, 1, amount, "0x");
        await erc1155Instance.setApprovalForAll(erc721WrapperInstance.address, true);

        await erc721WrapperInstance.mintBox(owner.address, templateId, [
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId: 1,
            amount,
          },
        ]);
        const balanace = await erc1155Instance.balanceOf(erc721WrapperInstance.address, 1);
        expect(balanace).to.be.equal(amount);

        await erc721WrapperInstance.unpack(1);
        const balanace2 = await erc1155Instance.balanceOf(erc721WrapperInstance.address, 1);
        expect(balanace2).to.be.equal(0);
      });
    });

    describe("MIX", function () {
      it("should fail: not an owner", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const erc20Instance = await erc20Factory("ERC20Simple");
        const erc721WrapperInstance = await factory();

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(erc721WrapperInstance.address, amount);

        const tx = erc721WrapperInstance.mintBox(receiver.address, templateId, [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount,
          },
        ]);
        await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
      });

      it("should mint/unpack ALL", async function () {
        const [owner] = await ethers.getSigners();

        const erc721WrapperInstance = await factory();

        const erc20Instance = await erc20Factory("ERC20Simple");
        const erc721Instance = await erc721Factory("ERC721Simple");
        const erc998Instance = await erc998Factory("ERC998Simple");
        const erc1155Instance = await erc1155Factory("ERC1155Simple");

        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(erc721WrapperInstance.address, amount);

        await erc721Instance.mintCommon(owner.address, 1);
        await erc721Instance.setApprovalForAll(erc721WrapperInstance.address, true);

        await erc1155Instance.mint(owner.address, 1, amount, "0x");
        await erc1155Instance.setApprovalForAll(erc721WrapperInstance.address, true);

        await erc998Instance.mintCommon(owner.address, 1);
        await erc998Instance.setApprovalForAll(erc721WrapperInstance.address, true);

        const balanace01 = await erc1155Instance.balanceOf(owner.address, 1);
        expect(balanace01).to.be.equal(amount);
        const balanace02 = await erc721Instance.balanceOf(owner.address);
        expect(balanace02).to.be.equal(1);
        const balanace03 = await erc998Instance.balanceOf(owner.address);
        expect(balanace03).to.be.equal(1);

        const tx1 = erc721WrapperInstance.mintBox(
          owner.address,
          templateId,
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId: 1,
              amount,
            },
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 1,
              amount,
            },
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: 1,
              amount,
            },
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId: 1,
              amount,
            },
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 1,
              amount,
            },
          ],
          { value: amount },
        );
        await expect(tx1).to.changeTokenBalances(erc20Instance, [owner, erc721WrapperInstance], [-amount, amount]);
        await expect(tx1).to.changeEtherBalances([owner, erc721WrapperInstance], [-amount, amount]);
        const balanace11 = await erc721Instance.balanceOf(owner.address);
        expect(balanace11).to.be.equal(0);
        const balanace12 = await erc998Instance.balanceOf(owner.address);
        expect(balanace12).to.be.equal(0);
        const balanace13 = await erc1155Instance.balanceOf(owner.address, 1);
        expect(balanace13).to.be.equal(0);

        const tx2 = erc721WrapperInstance.unpack(1);
        await expect(tx2).to.changeTokenBalances(erc20Instance, [owner, erc721WrapperInstance], [amount, -amount]);
        await expect(tx2).to.changeEtherBalances([owner, erc721WrapperInstance], [amount, -amount]);
        const balanace21 = await erc721Instance.balanceOf(owner.address);
        expect(balanace21).to.be.equal(1);
        const balanace22 = await erc998Instance.balanceOf(owner.address);
        expect(balanace22).to.be.equal(1);
        const balanace23 = await erc1155Instance.balanceOf(owner.address, 1);
        expect(balanace23).to.be.equal(amount);
      });
    });
  });
});

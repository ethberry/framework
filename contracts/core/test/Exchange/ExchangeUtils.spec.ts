import { expect } from "chai";
import { ethers, network } from "hardhat";
import { constants } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";
import { amount, MINTER_ROLE } from "@gemunion/contracts-constants";

import { ExchangeMock, VRFCoordinatorMock } from "../../typechain-types";
import { subscriptionId, templateId, tokenId } from "../constants";
import { deployContract } from "../shared/fixture";
import { deployLinkVrfFixture } from "../shared/link";
import { randomRequest } from "../shared/randomRequest";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { deployERC1155 } from "../ERC1155/shared/fixtures";
import { deployERC1363 } from "../ERC20/shared/fixtures";

const enabled = {
  native: false,
  erc20: false,
  erc721: false,
  erc998: false,
  erc1155: false,
};

const disabled = {
  native: true,
  erc20: true,
  erc721: true,
  erc998: true,
  erc1155: true,
};

describe("ExchangeUtils", function () {
  describe("spendFrom", function () {
    describe("ETH", function () {
      it("should spendFrom: ETH => SELF", async function () {
        const [owner] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          exchangeInstance.address,
          enabled,
          { value: amount },
        );

        await expect(tx).changeEtherBalances([owner, exchangeInstance], [-amount, amount]);
      });

      it("should spendFrom: ETH => EOA", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
          { value: amount },
        );

        await expect(tx).changeEtherBalances([owner, receiver], [-amount, amount]);
      });

      it("should spendFrom: ETH => EOA (wrong amount)", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
          { value: 0 },
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "WrongAmount");
      });

      it("should spendFrom: ETH => Wallet", async function () {
        const [owner] = await ethers.getSigners();

        const walletInstance = await deployWallet();
        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          walletInstance.address,
          enabled,
          { value: amount },
        );

        await expect(tx).changeEtherBalances([owner, walletInstance], [-amount, amount]);
      });

      it("should spendFrom: ETH => Reverter", async function () {
        const [owner] = await ethers.getSigners();

        const jerkInstance = await deployJerk();
        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          jerkInstance.address,
          enabled,
          { value: amount },
        );

        await expect(tx).to.be.revertedWith("Address: unable to send value, recipient may have reverted");
      });
    });

    describe("ERC20", function () {
      it("should spendFrom: ERC20 => ERC1363 non Holder", async function () {
        const [owner] = await ethers.getSigners();

        const jerkInstance = await deployJerk();
        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Mock");
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          jerkInstance.address,
          enabled,
        );

        await expect(tx).to.emit(erc20Instance, "Transfer").withArgs(owner.address, jerkInstance.address, amount);
        await expect(tx).changeTokenBalances(erc20Instance, [owner, jerkInstance], [-amount, amount]);
      });

      it("should spendFrom: ERC20 => ERC1363 Holder", async function () {
        const [owner] = await ethers.getSigners();

        const walletInstance = await deployWallet();
        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Mock");
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          walletInstance.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(owner.address, walletInstance.address, amount)
          .not.to.emit(walletInstance, "TransferReceived");
        await expect(tx).changeTokenBalances(erc20Instance, [owner, walletInstance], [-amount, amount]);
      });

      it("should spendFrom: ERC20 => Self", async function () {
        const [owner] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Mock");
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          exchangeInstance.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(owner.address, exchangeInstance.address, amount)
          .not.to.emit(exchangeInstance, "TransferReceived");
        await expect(tx).changeTokenBalances(erc20Instance, [owner, exchangeInstance], [-amount, amount]);
      });

      it("should spendFrom: ERC20 => EOA", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Mock");
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx).to.emit(erc20Instance, "Transfer").withArgs(owner.address, receiver.address, amount);
        await expect(tx).changeTokenBalances(erc20Instance, [owner, receiver], [-amount, amount]);
      });

      it("should spendFrom: ERC20 => EOA (insufficient amount)", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Mock");
        // await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      });

      it("should spendFrom: ERC20 => EOA (insufficient allowance)", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Mock");
        await erc20Instance.mint(owner.address, amount);
        // await erc20Instance.approve(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
      });

      it("should spendFrom: ERC1363 => ERC1363 non Holder", async function () {
        const [owner] = await ethers.getSigners();

        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Simple");
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          jerkInstance.address,
          enabled,
        );

        await expect(tx).to.emit(erc20Instance, "Transfer").withArgs(owner.address, jerkInstance.address, amount);
        await expect(tx).changeTokenBalances(erc20Instance, [owner, jerkInstance], [-amount, amount]);
      });

      it("should spendFrom: ERC1363 => ERC1363 Holder", async function () {
        const [owner] = await ethers.getSigners();

        const walletInstance = await deployWallet();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Simple");
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          walletInstance.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(owner.address, walletInstance.address, amount)
          .to.emit(walletInstance, "TransferReceived");
        await expect(tx).changeTokenBalances(erc20Instance, [owner, walletInstance], [-amount, amount]);
      });

      it("should spendFrom: ERC1363 => Self", async function () {
        const [owner] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Simple");
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          exchangeInstance.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(owner.address, exchangeInstance.address, amount)
          .to.emit(exchangeInstance, "TransferReceived");
        await expect(tx).changeTokenBalances(erc20Instance, [owner, exchangeInstance], [-amount, amount]);
      });

      it("should spendFrom: ERC1363 => EOA", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Simple");
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx).to.emit(erc20Instance, "Transfer").withArgs(owner.address, receiver.address, amount);
        await expect(tx).changeTokenBalances(erc20Instance, [owner, receiver], [-amount, amount]);
      });
    });

    describe("ERC721", function () {
      it("should spendFrom: ERC721 => non Holder", async function () {
        const [owner] = await ethers.getSigners();

        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.mintCommon(owner.address, templateId);
        await erc721Instance.approve(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          jerkInstance.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer");
      });

      it("should spendFrom: ERC721 => Holder", async function () {
        const [owner] = await ethers.getSigners();

        const walletInstance = await deployWallet();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.mintCommon(owner.address, templateId);
        await erc721Instance.approve(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          walletInstance.address,
          enabled,
        );

        await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(owner.address, walletInstance.address, tokenId);

        const balance = await erc721Instance.balanceOf(walletInstance.address);
        expect(balance).to.equal(1);
      });

      it("should spendFrom: ERC721 => EOA", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.mintCommon(owner.address, templateId);
        await erc721Instance.approve(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(owner.address, receiver.address, tokenId);

        const balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });

      it("should spendFrom: ERC721 => EOA (not an owner)", async function () {
        const [owner, receiver, stranger] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.mintCommon(stranger.address, templateId);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC721: caller is not token owner or approved");
      });

      it("should spendFrom: ERC721 => EOA (not approved)", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.mintCommon(owner.address, templateId);
        // await erc721Instance.approve(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC721: caller is not token owner or approved");
      });
    });

    describe("ERC998", function () {
      it("should spendFrom: ERC998 => non Holder", async function () {
        const [owner] = await ethers.getSigners();

        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.mintCommon(owner.address, templateId);
        await erc998Instance.approve(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          jerkInstance.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer");
      });

      it("should spendFrom: ERC998 => Holder", async function () {
        const [owner] = await ethers.getSigners();

        const walletInstance = await deployWallet();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.mintCommon(owner.address, templateId);
        await erc998Instance.approve(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          walletInstance.address,
          enabled,
        );

        await expect(tx).to.emit(erc998Instance, "Transfer").withArgs(owner.address, walletInstance.address, tokenId);

        const balance = await erc998Instance.balanceOf(walletInstance.address);
        expect(balance).to.equal(1);
      });

      it("should spendFrom: ERC998 => EOA", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.mintCommon(owner.address, templateId);
        await erc998Instance.approve(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx).to.emit(erc998Instance, "Transfer").withArgs(owner.address, receiver.address, tokenId);

        const balance = await erc998Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });

      it("should spendFrom: ERC998 => EOA (not an owner)", async function () {
        const [owner, receiver, stranger] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.mintCommon(stranger.address, templateId);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC721: caller is not token owner or approved");
      });

      it("should spendFrom: ERC998 => EOA (not approved)", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.mintCommon(owner.address, templateId);
        // await erc998Instance.approve(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC721: caller is not token owner or approved");
      });
    });

    describe("ERC1155", function () {
      it("should spendFrom: ERC1155 => non Holder", async function () {
        const [owner] = await ethers.getSigners();

        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        await erc1155Instance.mint(owner.address, templateId, amount, "0x");
        await erc1155Instance.setApprovalForAll(exchangeInstance.address, true);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          jerkInstance.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC1155: transfer to non-ERC1155Receiver implementer");
      });

      it("should spendFrom: ERC1155 => Holder", async function () {
        const [owner] = await ethers.getSigners();

        const walletInstance = await deployWallet();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        await erc1155Instance.mint(owner.address, templateId, amount, "0x");
        await erc1155Instance.setApprovalForAll(exchangeInstance.address, true);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          walletInstance.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, owner.address, walletInstance.address, tokenId, amount);

        const balance = await erc1155Instance.balanceOf(walletInstance.address, templateId);
        expect(balance).to.equal(amount);
      });

      it("should spendFrom: ERC1155 => EOA", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        await erc1155Instance.mint(owner.address, templateId, amount, "0x");
        await erc1155Instance.setApprovalForAll(exchangeInstance.address, true);

        const tx = exchangeInstance.connect(receiver).testSpendFrom(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, owner.address, receiver.address, tokenId, amount);

        const balance = await erc1155Instance.balanceOf(receiver.address, 1);
        expect(balance).to.equal(amount);
      });

      it("should spendFrom: ERC1155 => EOA (insufficient amount)", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        // await erc1155Instance.mint(owner.address, templateId, amount, "0x");
        await erc1155Instance.setApprovalForAll(exchangeInstance.address, true);

        const tx = exchangeInstance.connect(receiver).testSpendFrom(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC1155: insufficient balance for transfer");
      });

      it("should spendFrom: ERC1155 => EOA (insufficient allowance)", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        await erc1155Instance.mint(owner.address, templateId, amount, "0x");
        // await erc1155Instance.setApprovalForAll(exchangeInstance.address, true);

        const tx = exchangeInstance.connect(receiver).testSpendFrom(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC1155: caller is not token owner or approved");
      });
    });

    describe("Disabled", function () {
      it("should fail spendFrom: ETH", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          receiver.address,
          disabled,
          { value: amount },
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });

      it("should fail spendFrom: ERC20", async function () {
        const [owner] = await ethers.getSigners();

        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Mock");
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: 0,
              amount,
            },
          ],
          owner.address,
          jerkInstance.address,
          disabled,
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });

      it("should fail spendFrom: ERC721", async function () {
        const [owner] = await ethers.getSigners();

        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.mintCommon(owner.address, templateId);
        await erc721Instance.approve(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          jerkInstance.address,
          disabled,
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });

      it("should fail spendFrom: ERC998", async function () {
        const [owner] = await ethers.getSigners();

        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.mintCommon(owner.address, templateId);
        await erc998Instance.approve(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          jerkInstance.address,
          disabled,
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });

      it("should fail spendFrom: ERC1155", async function () {
        const [owner] = await ethers.getSigners();

        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        await erc1155Instance.mint(owner.address, templateId, amount, "0x");
        await erc1155Instance.setApprovalForAll(exchangeInstance.address, true);

        const tx = exchangeInstance.testSpendFrom(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          jerkInstance.address,
          disabled,
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });
    });
  });

  describe("spend", function () {
    describe("ETH", function () {
      it("should spend: ETH => EOA", async function () {
        const [owner] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const tx1 = await exchangeInstance.topUp(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          { value: amount },
        );

        const lib = await ethers.getContractAt("ExchangeUtils", exchangeInstance.address, owner);

        await expect(tx1).to.emit(lib, "PaymentEthReceived").withArgs(exchangeInstance.address, amount);
        await expect(tx1).to.changeEtherBalances([owner, exchangeInstance], [-amount, amount]);

        const tx2 = exchangeInstance.testSpend(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          owner.address,
          enabled,
        );

        await expect(tx2).changeEtherBalances([exchangeInstance, owner], [-amount, amount]);
      });

      it("should spend: ETH => EOA (insufficient amount)", async function () {
        const [owner] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          owner.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("Address: insufficient balance");
      });
    });

    describe("ERC20", function () {
      it("should spend: ERC20 => ERC1363 non Holder", async function () {
        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Mock");
        await erc20Instance.mint(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          jerkInstance.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(exchangeInstance.address, jerkInstance.address, amount);

        await expect(tx).changeTokenBalances(erc20Instance, [exchangeInstance, jerkInstance], [-amount, amount]);
      });

      it("should spend: ERC20 => ERC1363 Holder", async function () {
        const walletInstance = await deployWallet();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Mock");
        await erc20Instance.mint(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          walletInstance.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(exchangeInstance.address, walletInstance.address, amount)
          .not.to.emit(walletInstance, "TransferReceived");

        await expect(tx).changeTokenBalances(erc20Instance, [exchangeInstance, walletInstance], [-amount, amount]);
      });

      it("should spend: ERC20 => EOA", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Mock");
        await erc20Instance.mint(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(exchangeInstance.address, receiver.address, amount);
        await expect(tx).changeTokenBalances(erc20Instance, [exchangeInstance, receiver], [-amount, amount]);
      });

      it("should spend: ERC20 => EOA (insufficient amount)", async function () {
        const [owner] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Mock");
        // await erc20Instance.mint(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          owner.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      });

      it("should spend: ERC1363 => ERC1363 non Holder", async function () {
        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Simple");
        await erc20Instance.mint(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          jerkInstance.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(exchangeInstance.address, jerkInstance.address, amount);
        await expect(tx).changeTokenBalances(erc20Instance, [exchangeInstance, jerkInstance], [-amount, amount]);
      });

      it("should spend: ERC1363 => ERC1363 Holder", async function () {
        const walletInstance = await deployWallet();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Simple");
        await erc20Instance.mint(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          walletInstance.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(exchangeInstance.address, walletInstance.address, amount)
          .to.emit(walletInstance, "TransferReceived");

        await expect(tx).changeTokenBalances(erc20Instance, [exchangeInstance, walletInstance], [-amount, amount]);
      });

      it("should spend: ERC1363 => EOA", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Simple");
        await erc20Instance.mint(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(exchangeInstance.address, receiver.address, amount);
        await expect(tx).changeTokenBalances(erc20Instance, [exchangeInstance, receiver], [-amount, amount]);
      });
    });

    describe("ERC721", function () {
      it("should spend: ERC721 => non Holder", async function () {
        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const jerkInstance = await deployJerk();

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.mintCommon(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          jerkInstance.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer");
      });

      it("should spend: ERC721 => Holder ", async function () {
        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const walletInstance = await deployWallet();

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.mintCommon(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          walletInstance.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc721Instance, "Transfer")
          .withArgs(exchangeInstance.address, walletInstance.address, tokenId);

        const balance = await erc721Instance.balanceOf(walletInstance.address);
        expect(balance).to.equal(1);
      });

      it("should spend: ERC721 => EOA", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.mintCommon(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc721Instance, "Transfer")
          .withArgs(exchangeInstance.address, receiver.address, tokenId);

        const balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });

      it("should spend: ERC721 => EOA (not an owner)", async function () {
        const [_owner, receiver, stranger] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.mintCommon(stranger.address, templateId);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC721: caller is not token owner or approved");
      });
    });

    describe("ERC998", function () {
      it("should spend: ERC998 => non Holder", async function () {
        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const jerkInstance = await deployJerk();

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.mintCommon(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId,
              amount,
            },
          ],
          jerkInstance.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer");
      });

      it("should spend: ERC998 => Holder ", async function () {
        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");
        const walletInstance = await deployWallet();

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.mintCommon(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId,
              amount,
            },
          ],
          walletInstance.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc998Instance, "Transfer")
          .withArgs(exchangeInstance.address, walletInstance.address, tokenId);

        const balance = await erc998Instance.balanceOf(walletInstance.address);
        expect(balance).to.equal(1);
      });

      it("should spend: ERC998 => EOA", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.mintCommon(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc998Instance, "Transfer")
          .withArgs(exchangeInstance.address, receiver.address, tokenId);

        const balance = await erc998Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });

      it("should spend: ERC998 => EOA (not an owner)", async function () {
        const [_owner, receiver, stranger] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.mintCommon(stranger.address, templateId);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC721: caller is not token owner or approved");
      });
    });

    describe("ERC1155", function () {
      it("should spend: ERC1155 => non Holder", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        await erc1155Instance.mint(exchangeInstance.address, templateId, amount, "0x");

        const tx = exchangeInstance.connect(receiver).testSpend(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          jerkInstance.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC1155: transfer to non-ERC1155Receiver implementer");
      });

      it("should spend: ERC1155 => Holder", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const walletInstance = await deployWallet();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        await erc1155Instance.mint(exchangeInstance.address, templateId, amount, "0x");

        const tx = exchangeInstance.connect(receiver).testSpend(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          walletInstance.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, exchangeInstance.address, walletInstance.address, tokenId, amount);

        const balance = await erc1155Instance.balanceOf(walletInstance.address, templateId);
        expect(balance).to.equal(amount);
      });

      it("should spend: ERC1155 => EOA", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        await erc1155Instance.mint(exchangeInstance.address, templateId, amount, "0x");

        const tx = exchangeInstance.connect(receiver).testSpend(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, exchangeInstance.address, receiver.address, tokenId, amount);

        const balance = await erc1155Instance.balanceOf(receiver.address, templateId);
        expect(balance).to.equal(amount);
      });

      it("should spend: ERC1155 => EOA (insufficient amount)", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        // await erc1155Instance.mint(exchangeInstance.address, templateId, amount, "0x");

        const tx = exchangeInstance.connect(receiver).testSpend(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx).to.be.revertedWith("ERC1155: insufficient balance for transfer");
      });
    });

    describe("Disabled", function () {
      it("should fail spend: ETH", async function () {
        const [owner] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          owner.address,
          disabled,
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });

      it("should fail spend: ERC20", async function () {
        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Mock");
        await erc20Instance.mint(exchangeInstance.address, amount);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          jerkInstance.address,
          disabled,
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });

      it("should fail spend: ERC721", async function () {
        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.mintCommon(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          erc721Instance.address,
          disabled,
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });

      it("should fail spend: ERC998", async function () {
        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.mintCommon(exchangeInstance.address, templateId);

        const tx = exchangeInstance.testSpend(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId,
              amount,
            },
          ],
          erc998Instance.address,
          disabled,
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });

      it("should fail spend: ERC1155", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const jerkInstance = await deployJerk();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        await erc1155Instance.mint(exchangeInstance.address, templateId, amount, "0x");

        const tx = exchangeInstance.connect(receiver).testSpend(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          jerkInstance.address,
          disabled,
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });
    });
  });

  describe("acquire", function () {
    describe("ETH", function () {
      it("should mint: ETH => EOA", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const tx1 = await exchangeInstance.topUp(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          { value: amount },
        );

        const lib = await ethers.getContractAt("ExchangeUtils", exchangeInstance.address, owner);
        await expect(tx1).to.emit(lib, "PaymentEthReceived").withArgs(exchangeInstance.address, amount);
        await expect(tx1).to.changeEtherBalances([owner, exchangeInstance], [-amount, amount]);

        const tx2 = exchangeInstance.testAcquire(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx2).to.emit(lib, "PaymentEthSent").withArgs(receiver.address, amount);
        await expect(tx2).changeEtherBalances([exchangeInstance, receiver], [-amount, amount]);
      });
    });

    describe("ERC20", function () {
      it("should mint: ERC20 => EOA", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Simple");
        await erc20Instance.mint(exchangeInstance.address, amount);

        const tx = exchangeInstance.testAcquire(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(exchangeInstance.address, receiver.address, amount);

        await expect(tx).changeTokenBalances(erc20Instance, [exchangeInstance, receiver], [-amount, amount]);
      });
    });

    describe("ERC721", function () {
      let vrfInstance: VRFCoordinatorMock;

      before(async function () {
        await network.provider.send("hardhat_reset");

        // https://github.com/NomicFoundation/hardhat/issues/2980
        ({ vrfInstance } = await loadFixture(function staking() {
          return deployLinkVrfFixture();
        }));
      });

      it("should mint: ERC721 => EOA (Simple)", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

        const tx = exchangeInstance.testAcquire(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: templateId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

        const balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });

      it("should mint: ERC721 => EOA (Random)", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc721Instance = await deployERC721("ERC721Random");
        await erc721Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

        await erc721Instance.grantRole(MINTER_ROLE, vrfInstance.address);
        await vrfInstance.addConsumer(subscriptionId, erc721Instance.address);

        await exchangeInstance.testAcquire(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: templateId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await randomRequest(erc721Instance, vrfInstance);

        // await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

        const balance = await erc721Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });
    });

    describe("ERC998", function () {
      let vrfInstance: VRFCoordinatorMock;

      before(async function () {
        await network.provider.send("hardhat_reset");

        // https://github.com/NomicFoundation/hardhat/issues/2980
        ({ vrfInstance } = await loadFixture(function staking() {
          return deployLinkVrfFixture();
        }));
      });

      it("should mint: ERC998 => EOA (Simple)", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

        const tx = exchangeInstance.testAcquire(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId: templateId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx).to.emit(erc998Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

        const balance = await erc998Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });

      it("should mint: ERC998 => EOA (Random)", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc998Instance = await deployERC721("ERC998Random");
        await erc998Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

        await erc998Instance.grantRole(MINTER_ROLE, vrfInstance.address);
        await vrfInstance.addConsumer(subscriptionId, erc998Instance.address);

        await exchangeInstance.testAcquire(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId: templateId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await randomRequest(erc998Instance, vrfInstance);

        // await expect(tx).to.emit(erc998Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

        const balance = await erc998Instance.balanceOf(receiver.address);
        expect(balance).to.equal(1);
      });
    });

    describe("ERC1155", function () {
      it("should mint: ERC1155 => EOA", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        await erc1155Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

        const tx = exchangeInstance.testAcquire(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          enabled,
        );

        await expect(tx)
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, constants.AddressZero, receiver.address, tokenId, amount);

        const balance = await erc1155Instance.balanceOf(receiver.address, tokenId);
        expect(balance).to.equal(amount);
      });
    });

    describe("Disabled", function () {
      it("should fail acquire: ETH", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const tx = exchangeInstance.testAcquire(
          [
            {
              tokenType: 0,
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          disabled,
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });

      it("should fail acquire: ERC20", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc20Instance = await deployERC1363("ERC20Simple");
        await erc20Instance.mint(exchangeInstance.address, amount);

        const tx = exchangeInstance.testAcquire(
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          disabled,
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });

      it("should fail acquire: ERC721", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc721Instance = await deployERC721("ERC721Simple");
        await erc721Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

        const tx = exchangeInstance.testAcquire(
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: templateId,
              amount,
            },
          ],
          receiver.address,
          disabled,
        );
        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });

      it("should fail acquire: ERC998", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc998Instance = await deployERC721("ERC998Simple");
        await erc998Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

        const tx = exchangeInstance.testAcquire(
          [
            {
              tokenType: 3,
              token: erc998Instance.address,
              tokenId: templateId,
              amount,
            },
          ],
          receiver.address,
          disabled,
        );
        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });

      it("should fail acquire: ERC1155", async function () {
        const [_owner, receiver] = await ethers.getSigners();

        const exchangeInstance = await deployContract<ExchangeMock>("ExchangeMock");

        const erc1155Instance = await deployERC1155("ERC1155Simple");
        await erc1155Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

        const tx = exchangeInstance.testAcquire(
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          receiver.address,
          disabled,
        );

        await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "UnsupportedTokenType");
      });
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, constants, utils } from "ethers";

import { amount, METADATA_ROLE, nonce } from "@gemunion/contracts-constants";

import { expiresAt, externalId, params, templateId, tokenId } from "../constants";

import { deployErc721Base, deployExchangeFixture } from "./shared/fixture";
import { deployERC20 } from "../ERC20/shared/fixtures";
import { isEqualArray, isEqualEventArgArrObj } from "../utils";

describe("ExchangeRentable", function () {
  describe("lend", function () {
    it("should lend ERC721 to user for free", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721BlacklistUpgradeableRentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

      await erc721Instance.connect(receiver).approve(exchangeInstance.address, tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = utils.hexZeroPad(ethers.utils.hexlify(endTimestamp), 32);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
          extra: expires,
        },
        items: [
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        ],
        price: [],
        extra: expires,
      });
      const tx1 = exchangeInstance.connect(receiver).lend(
        {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
          extra: expires,
        },
        [
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        ],
        [],
        signature,
      );
      // event Lend(address from, address to, uint64 expires, uint8 lendType, Asset[] items, Asset[] price);
      await expect(tx1)
        .to.emit(exchangeInstance, "Lend")
        .withArgs(
          receiver.address,
          stranger.address,
          endTimestamp,
          externalId,
          isEqualEventArgArrObj({
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: BigNumber.from(tokenId),
            amount: BigNumber.from(1),
          }),
          isEqualArray([[]]),
        )
        .to.emit(erc721Instance, "UpdateUser")
        .withArgs(tokenId, stranger.address, endTimestamp);

      const user = await erc721Instance.userOf(tokenId);
      expect(user).to.equal(stranger.address);
      const rentExpires = await erc721Instance.userExpires(tokenId);
      expect(rentExpires).to.equal(endTimestamp);
    });

    it("should lend ERC721 to user for ERC20", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721BlacklistUpgradeableRentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

      const erc20Instance = await deployERC20("ERC20Simple");
      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);
      await erc721Instance.connect(receiver).approve(exchangeInstance.address, tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = utils.hexZeroPad(ethers.utils.hexlify(endTimestamp), 32);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
          extra: expires,
        },
        items: [
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
      });

      const tx1 = exchangeInstance.connect(receiver).lend(
        {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
          extra: expires,
        },
        [
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        ],
        [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx1)
        .to.changeTokenBalances(erc20Instance, [receiver, exchangeInstance], [-amount, amount])
        .to.emit(exchangeInstance, "Lend")
        .withArgs(
          receiver.address,
          stranger.address,
          endTimestamp,
          externalId,
          isEqualEventArgArrObj({
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: BigNumber.from(tokenId),
            amount: BigNumber.from(1),
          }),
          isEqualEventArgArrObj({
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: BigNumber.from(tokenId),
            amount: BigNumber.from(amount),
          }),
        )
        .to.emit(erc721Instance, "UpdateUser")
        .withArgs(tokenId, stranger.address, endTimestamp);

      const user = await erc721Instance.userOf(tokenId);
      expect(user).to.equal(stranger.address);
      const rentExpires = await erc721Instance.userExpires(tokenId);
      expect(rentExpires).to.equal(endTimestamp);
    });

    it("should fail: Wrong signer", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721BlacklistUpgradeableRentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

      const erc20Instance = await deployERC20("ERC20Simple");
      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);
      await erc721Instance.connect(receiver).approve(exchangeInstance.address, tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = utils.hexZeroPad(ethers.utils.hexlify(endTimestamp), 32);

      const signature = await generateManyToManySignature({
        account: stranger.address,
        params: {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
          extra: expires,
        },
        items: [
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
      });

      const tx1 = exchangeInstance.connect(receiver).lend(
        {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
          extra: expires,
        },
        [
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        ],
        [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "WrongSigner");
    });

    it("should fail: Wrong items count", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721BlacklistUpgradeableRentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

      const erc20Instance = await deployERC20("ERC20Simple");
      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);
      await erc721Instance.connect(receiver).approve(exchangeInstance.address, tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = utils.hexZeroPad(ethers.utils.hexlify(endTimestamp), 32);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
          extra: expires,
        },
        items: [],
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        extra: expires,
      });

      const tx1 = exchangeInstance.connect(receiver).lend(
        {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
          extra: expires,
        },
        [],
        [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "WrongAmount");
    });

    it("should fail: Transfer caller is not owner nor approved", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721BlacklistUpgradeableRentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

      const erc20Instance = await deployERC20("ERC20Simple");
      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(exchangeInstance.address, amount);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = utils.hexZeroPad(ethers.utils.hexlify(endTimestamp), 32);

      const signature = await generateManyToManySignature({
        account: owner.address,
        params: {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
          extra: expires,
        },
        items: [
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        extra: expires,
      });

      const tx1 = exchangeInstance.lend(
        {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
          extra: expires,
        },
        [
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        ],
        [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx1).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });

    it("should fail: paused", async function () {
      const { contractInstance: exchangeInstance } = await deployExchangeFixture();

      await exchangeInstance.pause();

      const tx1 = exchangeInstance.lend(
        params,
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        constants.HashZero,
      );

      await expect(tx1).to.be.revertedWith("Pausable: paused");
    });

    it("should fail: signer is missing role", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721BlacklistUpgradeableRentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

      await erc721Instance.connect(receiver).approve(exchangeInstance.address, tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = utils.hexZeroPad(ethers.utils.hexlify(endTimestamp), 32);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
          extra: expires,
        },
        items: [
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        ],
        price: [],
        extra: expires,
      });

      await exchangeInstance.renounceRole(METADATA_ROLE, owner.address);

      const tx1 = exchangeInstance.connect(receiver).lend(
        {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
          extra: expires,
        },
        [
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
        ],
        [],
        signature,
      );

      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "WrongSigner");
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, constants, utils } from "ethers";

import { amount, nonce } from "@gemunion/contracts-constants";

import { expiresAt, externalId, templateId, tokenId } from "../constants";

import { deployErc721Base, deployExchangeFixture } from "./shared/fixture";
import { deployERC20 } from "../ERC20/shared/fixtures";
import { isEqualArray, isEqualEventArgArrObj } from "../utils";

describe("ExchangeRentable", function () {
  describe("lend", function () {
    it("should lend ERC721 to user for free", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManyExtraSignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721BlacklistUpgradeableRentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, tokenId);

      await erc721Instance.connect(receiver).approve(exchangeInstance.address, tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = utils.hexZeroPad(ethers.utils.hexlify(endTimestamp), 32);

      const signature = await generateManyToManyExtraSignature({
        account: receiver.address,
        params: {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
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
        expires,
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
      const { contractInstance: exchangeInstance, generateManyToManyExtraSignature } = await deployExchangeFixture();
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

      const signature = await generateManyToManyExtraSignature({
        account: receiver.address,
        params: {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
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

      const tx1 = exchangeInstance.connect(receiver).lend(
        {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
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
        expires,
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
      const { contractInstance: exchangeInstance, generateManyToManyExtraSignature } = await deployExchangeFixture();
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

      const signature = await generateManyToManyExtraSignature({
        account: stranger.address,
        params: {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
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

      const tx1 = exchangeInstance.connect(receiver).lend(
        {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
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
        expires,
        signature,
      );

      await expect(tx1).to.be.revertedWith("Exchange: Wrong signer");
    });

    it("should fail: Wrong items count", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManyExtraSignature } = await deployExchangeFixture();
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

      const signature = await generateManyToManyExtraSignature({
        account: receiver.address,
        params: {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
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
        expires,
        signature,
      );

      await expect(tx1).to.be.revertedWith("Exchange: Wrong items count");
    });

    it("should fail: Transfer caller is not owner nor approved", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManyExtraSignature } = await deployExchangeFixture();
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

      const signature = await generateManyToManyExtraSignature({
        account: owner.address,
        params: {
          nonce,
          externalId /* lendType */,
          expiresAt,
          referrer: stranger.address,
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
        expires,
        signature,
      );

      await expect(tx1).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";
import { toBeHex, ZeroAddress, ZeroHash, zeroPadValue } from "ethers";

import { amount, METADATA_ROLE, nonce } from "@gemunion/contracts-constants";

import { expiresAt, externalId, params, templateId, tokenId } from "../constants";
import { deployERC1363 } from "../ERC20/shared/fixtures";
import { isEqualArray, isEqualEventArgArrObj, isEqualEventArgObj } from "../utils";
import { deployErc721Base, deployExchangeFixture } from "./shared/fixture";

describe("ExchangeRentable", function () {
  describe("lend", function () {
    it("should lend ERC721 to user for free", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721Rentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      await erc721Instance.connect(receiver).approve(await exchangeInstance.getAddress(), tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = zeroPadValue(toBeHex(endTimestamp), 32);

      const signature = await generateOneToManySignature({
        account: receiver.address,
        params: {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 1,
        },
        price: [],
      });
      const tx1 = exchangeInstance.connect(receiver).lend(
        {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 1,
        },
        [],
        signature,
      );

      await expect(tx1)
        .to.emit(exchangeInstance, "Lend")
        .withArgs(
          receiver.address,
          stranger.address,
          endTimestamp,
          externalId,
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1n,
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
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721Rentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      const erc20Instance = await deployERC1363("ERC20Simple");
      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);
      await erc721Instance.connect(receiver).approve(await exchangeInstance.getAddress(), tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = zeroPadValue(toBeHex(endTimestamp), 32);

      const signature = await generateOneToManySignature({
        account: receiver.address,
        params: {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 1,
        },
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
      });

      const tx1 = exchangeInstance.connect(receiver).lend(
        {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 1,
        },
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
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
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1n,
          }),
          isEqualEventArgArrObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
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
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721Rentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      const erc20Instance = await deployERC1363("ERC20Simple");
      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);
      await erc721Instance.connect(receiver).approve(await exchangeInstance.getAddress(), tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = zeroPadValue(toBeHex(endTimestamp), 32);

      const signature = await generateOneToManySignature({
        account: stranger.address,
        params: {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 1,
        },
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
      });

      const tx1 = exchangeInstance.connect(receiver).lend(
        {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 1,
        },
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "SignerMissingRole");
    });

    it("should fail: Transfer caller is not owner nor approved", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721Rentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      const erc20Instance = await deployERC1363("ERC20Simple");
      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(await exchangeInstance.getAddress(), amount);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = zeroPadValue(toBeHex(endTimestamp), 32);

      const signature = await generateOneToManySignature({
        account: owner.address,
        params: {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 1,
        },
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
      });

      const tx1 = exchangeInstance.lend(
        {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 1,
        },
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
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
        {
          tokenType: 0,
          token: ZeroAddress,
          tokenId,
          amount,
        },
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId,
            amount,
          },
        ],
        ZeroHash,
      );

      await expect(tx1).to.be.revertedWith("Pausable: paused");
    });

    it("should fail: signer is missing role", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721Rentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      await erc721Instance.connect(receiver).approve(await exchangeInstance.getAddress(), tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = zeroPadValue(toBeHex(endTimestamp), 32);

      const signature = await generateOneToManySignature({
        account: receiver.address,
        params: {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 1,
        },
        price: [],
      });

      await exchangeInstance.renounceRole(METADATA_ROLE, owner.address);

      const tx1 = exchangeInstance.connect(receiver).lend(
        {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount: 1,
        },
        [],
        signature,
      );

      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "SignerMissingRole");
    });
  });

  describe("lendMany", function () {
    it("should lend ERC721 to user for free", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721Rentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      await erc721Instance.connect(receiver).approve(await exchangeInstance.getAddress(), tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = zeroPadValue(toBeHex(endTimestamp), 32);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        items: [
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1,
          },
        ],
        price: [],
        extra: expires,
      });
      const tx1 = exchangeInstance.connect(receiver).lendMany(
        {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        [
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1,
          },
        ],
        [],
        signature,
      );

      await expect(tx1)
        .to.emit(exchangeInstance, "LendMany")
        .withArgs(
          receiver.address,
          stranger.address,
          endTimestamp,
          externalId,
          isEqualEventArgArrObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1n,
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
      const erc721Instance = await deployErc721Base("ERC721Rentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      const erc20Instance = await deployERC1363("ERC20Simple");
      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);
      await erc721Instance.connect(receiver).approve(await exchangeInstance.getAddress(), tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = zeroPadValue(toBeHex(endTimestamp), 32);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        items: [
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
      });

      const tx1 = exchangeInstance.connect(receiver).lendMany(
        {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        [
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1,
          },
        ],
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx1)
        .to.changeTokenBalances(erc20Instance, [receiver, exchangeInstance], [-amount, amount])
        .to.emit(exchangeInstance, "LendMany")
        .withArgs(
          receiver.address,
          stranger.address,
          endTimestamp,
          externalId,
          isEqualEventArgArrObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1n,
          }),
          isEqualEventArgArrObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
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
      const erc721Instance = await deployErc721Base("ERC721Rentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      const erc20Instance = await deployERC1363("ERC20Simple");
      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);
      await erc721Instance.connect(receiver).approve(await exchangeInstance.getAddress(), tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = zeroPadValue(toBeHex(endTimestamp), 32);

      const signature = await generateManyToManySignature({
        account: stranger.address,
        params: {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        items: [
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
      });

      const tx1 = exchangeInstance.connect(receiver).lendMany(
        {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        [
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1,
          },
        ],
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "SignerMissingRole");
    });

    it("should fail: Wrong items count", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721Rentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      const erc20Instance = await deployERC1363("ERC20Simple");
      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);
      await erc721Instance.connect(receiver).approve(await exchangeInstance.getAddress(), tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = zeroPadValue(toBeHex(endTimestamp), 32);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        items: [],
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        extra: expires,
      });

      const tx1 = exchangeInstance.connect(receiver).lendMany(
        {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        [],
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
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
      const erc721Instance = await deployErc721Base("ERC721Rentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      const erc20Instance = await deployERC1363("ERC20Simple");
      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(await exchangeInstance.getAddress(), amount);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = zeroPadValue(toBeHex(endTimestamp), 32);

      const signature = await generateManyToManySignature({
        account: owner.address,
        params: {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        items: [
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        extra: expires,
      });

      const tx1 = exchangeInstance.lendMany(
        {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        [
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1,
          },
        ],
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
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

      const tx1 = exchangeInstance.lendMany(
        params,
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId,
            amount,
          },
        ],
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId,
            amount,
          },
        ],
        ZeroHash,
      );

      await expect(tx1).to.be.revertedWith("Pausable: paused");
    });

    it("should fail: signer is missing role", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
      const erc721Instance = await deployErc721Base("ERC721Rentable", exchangeInstance);

      const tx0 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx0).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      await erc721Instance.connect(receiver).approve(await exchangeInstance.getAddress(), tokenId);

      // lend TIME
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const endTimestamp = Math.ceil(date.getTime() / 1000); // in seconds,
      const expires = zeroPadValue(toBeHex(endTimestamp), 32);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        items: [
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1,
          },
        ],
        price: [],
        extra: expires,
      });

      await exchangeInstance.renounceRole(METADATA_ROLE, owner.address);

      const tx1 = exchangeInstance.connect(receiver).lendMany(
        {
          externalId /* lendType */,
          expiresAt,
          nonce,
          extra: expires,
          receiver: stranger.address,
          referrer: stranger.address,
        },
        [
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount: 1,
          },
        ],
        [],
        signature,
      );

      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "SignerMissingRole");
    });
  });
});

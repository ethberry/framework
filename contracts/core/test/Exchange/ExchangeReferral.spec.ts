import { expect } from "chai";
import { ethers } from "hardhat";
import { randomBytes, ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import { expiresAt, externalId, extra, tokenId, tokenZero } from "../constants";
import { deployErc20Base, deployErc721Base, deployExchangeFixture } from "./shared/fixture";

describe("ExchangeReferral", function () {
  const refProgram = {
    maxRefs: 10n,
    refReward: 10n * 100n, // 10.00 %
    refDecrease: 10n, // 10% - 1% - 0.1% - 0.01% etc.
  };

  describe("exchange purchase", function () {
    it("referrer rewards", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

      // SET REF PROGRAM
      const tx = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      const refParams1 = {
        externalId,
        expiresAt,
        nonce: randomBytes(32),
        extra,
        receiver: ZeroAddress,
        referrer: ZeroAddress,
      };

      const signature1 = await generateOneToManySignature({
        account: owner.address,
        params: refParams1,
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
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

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.connect(owner).approve(await exchangeInstance.getAddress(), amount);

      const tx1 = exchangeInstance.connect(owner).purchase(
        refParams1,
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature1,
      );

      await expect(tx1).to.emit(exchangeInstance, "Purchase").to.not.emit(exchangeInstance, "ReferralReward");

      const refParams2 = {
        externalId,
        expiresAt,
        nonce: randomBytes(32),
        extra,
        receiver: owner.address,
        referrer: owner.address,
      };

      const signature2 = await generateOneToManySignature({
        account: receiver.address,
        params: refParams2,
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
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

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);

      const tx2 = exchangeInstance.connect(receiver).purchase(
        refParams2,
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature2,
      );

      await expect(tx2)
        .to.emit(exchangeInstance, "Purchase")
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          owner.address,
          0,
          await erc20Instance.getAddress(),
          ((amount / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );

      const refParams3 = {
        externalId,
        expiresAt,
        nonce: randomBytes(32),
        extra,
        receiver: receiver.address,
        referrer: receiver.address,
      };

      const signature3 = await generateOneToManySignature({
        account: stranger.address,
        params: refParams3,
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
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

      await erc20Instance.mint(stranger.address, amount);
      await erc20Instance.connect(stranger).approve(await exchangeInstance.getAddress(), amount);

      const tx3 = exchangeInstance.connect(stranger).purchase(
        refParams3,
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature3,
      );

      await expect(tx3)
        .to.emit(exchangeInstance, "Purchase")
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          owner.address,
          1,
          await erc20Instance.getAddress(),
          ((amount / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 1n,
        )
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          receiver.address,
          0,
          await erc20Instance.getAddress(),
          ((amount / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );
    });
  });

  describe("getBalance", function () {
    it("should get zero balance", async function () {
      const [owner] = await ethers.getSigners();
      const { contractInstance: exchangeInstance } = await deployExchangeFixture();

      const balance = await exchangeInstance.getBalance(owner.address, tokenZero);
      expect(balance).to.equal(0);
    });

    it("should get non zero balance", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const erc20Instance = await deployErc20Base("ERC20Simple", exchangeInstance);
      const erc721Instance = await deployErc721Base("ERC721Simple", exchangeInstance);

      // SET REF PROGRAM
      const tx = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      const params = {
        externalId,
        expiresAt,
        nonce: randomBytes(32),
        extra,
        receiver: owner.address,
        referrer: owner.address,
      };

      const signature = await generateOneToManySignature({
        account: receiver.address,
        params,
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
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

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(await exchangeInstance.getAddress(), amount);

      const tx1 = exchangeInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
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
        .to.emit(exchangeInstance, "Purchase")
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          owner.address,
          0,
          await erc20Instance.getAddress(),
          ((amount / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );
      // .withArgs(receiver.address, owner.address, 0, WeiPerEther);

      const balance = await exchangeInstance.getBalance(owner.address, await erc20Instance.getAddress());
      expect(balance).to.equal(((amount / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n);
    });
  });
});

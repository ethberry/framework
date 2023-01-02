import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, constants, utils } from "ethers";

import { amount } from "@gemunion/contracts-constants";

import { expiresAt, externalId, tokenId, tokenZero } from "../../constants";
import { deployErc20Base, deployErc721Base, deployExchangeFixture } from "./shared/fixture";

describe("ExchangeReferral", function () {
  const refProgram = {
    maxRefs: 10,
    refReward: 10 * 100, // 10.00 %
    refDecrease: 10, // 10% - 1% - 0.1% - 0.01% etc.
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
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: constants.AddressZero,
      };

      const signature1 = await generateOneToManySignature({
        account: owner.address,
        params: refParams1,
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
      });

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.connect(owner).approve(exchangeInstance.address, amount);

      const tx1 = exchangeInstance.connect(owner).purchase(
        refParams1,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        signature1,
      );

      await expect(tx1).to.emit(exchangeInstance, "Purchase").to.not.emit(exchangeInstance, "ReferralReward");

      const refParams2 = {
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: owner.address,
      };

      const signature2 = await generateOneToManySignature({
        account: receiver.address,
        params: refParams2,
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
      });

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

      const tx2 = exchangeInstance.connect(receiver).purchase(
        refParams2,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        [
          {
            tokenType: 1,
            token: erc20Instance.address,
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
          erc20Instance.address,
          BigNumber.from(amount)
            .div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      const refParams3 = {
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: receiver.address,
      };

      const signature3 = await generateOneToManySignature({
        account: stranger.address,
        params: refParams3,
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
      });

      await erc20Instance.mint(stranger.address, amount);
      await erc20Instance.connect(stranger).approve(exchangeInstance.address, amount);

      const tx3 = exchangeInstance.connect(stranger).purchase(
        refParams3,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        [
          {
            tokenType: 1,
            token: erc20Instance.address,
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
          erc20Instance.address,
          BigNumber.from(amount)
            .div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        )
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          receiver.address,
          0,
          erc20Instance.address,
          BigNumber.from(amount)
            .div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
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
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: owner.address,
      };

      const signature = await generateOneToManySignature({
        account: receiver.address,
        params,
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
      });

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

      const tx1 = exchangeInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
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
        .to.emit(exchangeInstance, "Purchase")
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          owner.address,
          0,
          erc20Instance.address,
          BigNumber.from(amount)
            .div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );
      // .withArgs(receiver.address, owner.address, 0, constants.WeiPerEther);

      const balance = await exchangeInstance.getBalance(owner.address, erc20Instance.address);
      expect(balance).to.equal(
        BigNumber.from(amount)
          .div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
    });
  });
});

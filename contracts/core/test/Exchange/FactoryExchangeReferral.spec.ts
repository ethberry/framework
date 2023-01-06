import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { constants, utils } from "ethers";

import { blockAwait } from "@gemunion/contracts-utils";
import { nonce } from "@gemunion/contracts-constants";

import { amountWei, amountWeiEth, templateId, tokenZero } from "../constants";
import { factoryDeployErc721 } from "./shared/factoryDeployErc721";
import { factoryDeployErc20 } from "./shared/factoryDeployErc20";
import { deployContractManager, deployExchangeFixture } from "./shared/fixture";

use(solidity);

describe("Factory Exchange Referral", function () {
  const refProgram = {
    maxRefs: 10,
    refReward: 10 * 100, // 10.00 %
    // refReward: 3 * 100, // 3.00 %
    // refReward: 12 * 100, // 12.00 %
    // refReward: 550, // 5.5 %
    // refDecrease: 5, // 10% - 2% - 0.4% - 0.08% etc.
    refDecrease: 10, // 10% - 1% - 0.1% - 0.01% etc.
  };

  describe("Referral program", function () {
    it("should set Ref program", async function () {
      const { contractInstance: exchangeInstance } = await deployExchangeFixture();

      const tx = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      const program = await exchangeInstance.getRefProgram();
      expect(program.init).to.equal(true);
      expect(program._maxRefs).to.equal(refProgram.maxRefs);
      expect(program._refReward).to.equal(refProgram.refReward);
      expect(program._refDecrease).to.equal(refProgram.refDecrease);
    });

    it("should fail: wrong ref parameters", async function () {
      const { contractInstance: exchangeInstance } = await deployExchangeFixture();

      const tx = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward * 20, refProgram.refDecrease);
      await expect(tx).to.be.revertedWith("ExchangeReferral: wrong refReward");
    });

    it("should fail: program already set", async function () {
      const { contractInstance: exchangeInstance } = await deployExchangeFixture();

      const tx = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);
      const tx1 = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx1).to.be.revertedWith("ExchangeReferral: program already set");
    });
  });

  describe("Deploy, Purchase, Referral", function () {
    it("should Purchase without Reward (zero ref)", async function () {
      const [owner] = await ethers.getSigners();

      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const factoryInstance = await deployContractManager(exchangeInstance);
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance);

      const signature = await generateOneToManySignature({
        account: owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: constants.AddressZero,
        },
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: amountWei,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
      });

      const tx1 = exchangeInstance.connect(owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: constants.AddressZero,
        },
        {
          // ERC721
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: amountWei,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature,
        { value: amountWeiEth },
      );
      await expect(tx1).to.emit(exchangeInstance, "Purchase").to.not.emit(exchangeInstance, "ReferralReward");

      await blockAwait();

      await expect(tx1).to.emit(erc721Instance, "Transfer");

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);
    });

    it("should Purchase with Reward (one ref)", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const factoryInstance = await deployContractManager(exchangeInstance);
      // SET REF PROGRAM
      const tx = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance);
      const signature = await generateOneToManySignature({
        account: owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: stranger.address,
        },
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
      });
      const tx1 = exchangeInstance.connect(owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: stranger.address,
        },
        {
          // ERC721
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature,
        { value: constants.WeiPerEther },
      );
      await expect(tx1).to.emit(exchangeInstance, "Purchase");

      await blockAwait();

      await expect(tx1).to.emit(erc721Instance, "Transfer");

      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          owner.address,
          stranger.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);
    });

    it("should Purchase with Reward (multi ref)", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const factoryInstance = await deployContractManager(exchangeInstance);

      const tx0 = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx0)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance);

      const signature = await generateOneToManySignature({
        account: owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: receiver.address,
        },
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
      });
      const tx = exchangeInstance.connect(owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: receiver.address,
        },
        {
          // ERC721
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature,
        { value: constants.WeiPerEther },
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");
      await expect(tx).to.emit(erc721Instance, "Transfer");

      await expect(tx)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          owner.address,
          receiver.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      await blockAwait();

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);

      const nonce1 = utils.randomBytes(32);
      const signature1 = await generateOneToManySignature({
        account: stranger.address,
        params: {
          nonce: nonce1,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: owner.address,
        },
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
      });

      const tx1 = exchangeInstance.connect(stranger).purchase(
        {
          nonce: nonce1,
          externalId: templateId,
          expiresAt: 0,
          referrer: owner.address,
        },
        {
          // ERC721
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature1,
        { value: constants.WeiPerEther },
      );
      await expect(tx1).to.emit(exchangeInstance, "Purchase");
      await expect(tx1).to.emit(erc721Instance, "Transfer");

      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          owner.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          receiver.address,
          1,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        );

      const balance1 = await erc721Instance.balanceOf(stranger.address);
      expect(balance1).to.equal(1);

      const nonce2 = utils.randomBytes(32);
      const signature2 = await generateOneToManySignature({
        account: receiver.address,
        params: {
          nonce: nonce2,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: stranger.address,
        },
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
      });
      const tx2 = exchangeInstance.connect(receiver).purchase(
        {
          nonce: nonce2,
          externalId: templateId,
          expiresAt: 0,
          referrer: stranger.address,
        },
        {
          // ERC721
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature2,
        { value: constants.WeiPerEther },
      );
      await expect(tx2).to.emit(exchangeInstance, "Purchase");
      await expect(tx2).to.emit(erc721Instance, "Transfer");
      await expect(tx2)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          stranger.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      await expect(tx2)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          owner.address,
          1,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        );

      const balance2 = await erc721Instance.balanceOf(receiver.address);
      expect(balance2).to.equal(1);

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(5);
    });
  });

  describe("Balance Withdraw", function () {
    it("should fail: Zero balance", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { contractInstance: exchangeInstance } = await deployExchangeFixture();

      const tx = exchangeInstance.connect(receiver).withdrawReward(tokenZero);
      await expect(tx).to.be.revertedWith("ExchangeReferral: Zero balance");
    });

    it("should get referral Reward Balances", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const factoryInstance = await deployContractManager(exchangeInstance);

      // SET REF PROGRAM
      const tx0 = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx0)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance);

      const signature = await generateOneToManySignature({
        account: owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: receiver.address,
        },
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
      });
      const tx = exchangeInstance.connect(owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: receiver.address,
        },
        {
          // ERC721
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature,
        { value: constants.WeiPerEther },
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");
      await expect(tx).to.emit(erc721Instance, "Transfer");

      await expect(tx)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          owner.address,
          receiver.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      await blockAwait();

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);

      const nonce1 = utils.randomBytes(32);
      const signature1 = await generateOneToManySignature({
        account: stranger.address,
        params: {
          nonce: nonce1,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: owner.address,
        },
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
      });
      const tx1 = exchangeInstance.connect(stranger).purchase(
        {
          nonce: nonce1,
          externalId: templateId,
          expiresAt: 0,
          referrer: owner.address,
        },
        {
          // ERC721
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature1,
        { value: constants.WeiPerEther },
      );
      await expect(tx1).to.emit(exchangeInstance, "Purchase");
      await expect(tx1).to.emit(erc721Instance, "Transfer");

      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          owner.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );
      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          receiver.address,
          1,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        );

      const balance1 = await erc721Instance.balanceOf(stranger.address);
      expect(balance1).to.equal(1);

      const nonce2 = utils.randomBytes(32);
      const signature2 = await generateOneToManySignature({
        account: receiver.address,
        params: {
          nonce: nonce2,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: stranger.address,
        },
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
      });
      const tx2 = exchangeInstance.connect(receiver).purchase(
        {
          nonce: nonce2,
          externalId: templateId,
          expiresAt: 0,
          referrer: stranger.address,
        },
        {
          // ERC721
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature2,
        { value: constants.WeiPerEther },
      );
      await expect(tx2).to.emit(exchangeInstance, "Purchase");
      await expect(tx2).to.emit(erc721Instance, "Transfer");
      await expect(tx2)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          stranger.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      await expect(tx2)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          owner.address,
          1,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        );

      const balance2 = await erc721Instance.balanceOf(receiver.address);
      expect(balance2).to.equal(1);

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(5);

      const ownerRefBalance = await exchangeInstance.getBalance(owner.address, tokenZero);
      expect(ownerRefBalance).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0)
          .add(
            constants.WeiPerEther.div(100)
              .mul((refProgram.refReward / 100) | 0)
              .div(refProgram.refDecrease ** 1),
          ),
      );
      const receiverRefBalance = await exchangeInstance.getBalance(receiver.address, tokenZero);
      expect(receiverRefBalance).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0)
          .add(
            constants.WeiPerEther.div(100)
              .mul((refProgram.refReward / 100) | 0)
              .div(refProgram.refDecrease ** 1),
          ),
      );
      const strangerRefBalance = await exchangeInstance.getBalance(stranger.address, tokenZero);
      expect(strangerRefBalance).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
    });

    it("should withdraw referral Reward ETH (one)", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const factoryInstance = await deployContractManager(exchangeInstance);

      // SET REF PROGRAM
      const tx0 = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx0)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance);

      const signature = await generateOneToManySignature({
        account: owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: receiver.address,
        },
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
      });

      const tx = exchangeInstance.connect(owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: receiver.address,
        },
        {
          // ERC721
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature,
        { value: constants.WeiPerEther },
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");

      await blockAwait();

      await expect(tx).to.emit(erc721Instance, "Transfer");
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          owner.address, // buyer
          receiver.address, // referrer
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(1);

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);

      const refBalance = await exchangeInstance.connect(receiver).getBalance(receiver.address, tokenZero);
      expect(refBalance).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );

      const tx1 = exchangeInstance.connect(receiver).withdrawReward(tokenZero);
      await expect(tx1).to.changeEtherBalance(
        receiver,
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
    });

    it("should withdraw referral Reward ERC20 (one)", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const factoryInstance = await deployContractManager(exchangeInstance);

      // SET REF PROGRAM
      const tx0 = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx0)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance);
      const erc20Instance = await factoryDeployErc20(factoryInstance, exchangeInstance);
      // MINT ERC20
      const tenEth = constants.WeiPerEther.mul(10);
      await erc20Instance.mint(owner.address, tenEth);
      const ownerErc20Balance = await erc20Instance.balanceOf(owner.address);
      expect(ownerErc20Balance).to.equal(tenEth);
      // SET ALLOWANCE FOR EXCHANGE
      await erc20Instance.approve(exchangeInstance.address, constants.WeiPerEther);
      const allowance = await erc20Instance.allowance(owner.address, exchangeInstance.address);
      expect(allowance).to.equal(constants.WeiPerEther);

      const signature = await generateOneToManySignature({
        account: owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: receiver.address,
        },
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount: constants.WeiPerEther,
          },
        ],
      });

      const tx = exchangeInstance.connect(owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: receiver.address,
        },
        {
          // ERC721
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        [
          // ERC20
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount: constants.WeiPerEther,
          },
        ],
        signature,
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");

      await blockAwait();

      await expect(tx).to.emit(erc721Instance, "Transfer");
      await expect(tx).to.emit(erc20Instance, "Transfer");
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          owner.address, // buyer
          receiver.address, // referrer
          0, // level
          erc20Instance.address,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);

      const refBalanceEth = await exchangeInstance.connect(receiver).getBalance(receiver.address, tokenZero);
      expect(refBalanceEth).to.equal(0);
      const refBalanceErc20 = await exchangeInstance
        .connect(receiver)
        .getBalance(receiver.address, erc20Instance.address);
      expect(refBalanceErc20).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );

      const tx1 = exchangeInstance.connect(receiver).withdrawReward(erc20Instance.address);

      await expect(tx1).to.changeTokenBalance(
        erc20Instance,
        receiver,
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
    });

    it("should withdraw referral Rewards ETH and ERC20", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const factoryInstance = await deployContractManager(exchangeInstance);

      // SET REF PROGRAM
      const tx0 = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx0)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance);
      const erc20Instance = await factoryDeployErc20(factoryInstance, exchangeInstance);
      // MINT ERC20
      const tenEth = constants.WeiPerEther.mul(10);
      await erc20Instance.mint(owner.address, tenEth);
      const ownerErc20Balance = await erc20Instance.balanceOf(owner.address);
      expect(ownerErc20Balance).to.equal(tenEth);
      // SET ALLOWANCE FOR EXCHANGE
      await erc20Instance.approve(exchangeInstance.address, constants.WeiPerEther);
      const allowance = await erc20Instance.allowance(owner.address, exchangeInstance.address);
      expect(allowance).to.equal(constants.WeiPerEther);

      const signature = await generateOneToManySignature({
        account: owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: receiver.address,
        },
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount: constants.WeiPerEther,
          },
        ],
      });

      const tx = exchangeInstance.connect(owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: receiver.address,
        },
        {
          // ERC721
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        [
          {
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount: constants.WeiPerEther,
          },
        ],
        signature,
        { value: constants.WeiPerEther },
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");

      await blockAwait();

      await expect(tx).to.emit(erc20Instance, "Transfer");
      await expect(tx).to.emit(erc721Instance, "Transfer");

      await expect(tx) // ETH reward
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          owner.address,
          receiver.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      await expect(tx) // ERC20 reward
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          owner.address, // buyer
          receiver.address, // referrer
          0, // level
          erc20Instance.address,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);

      const refBalanceEth = await exchangeInstance.connect(receiver).getBalance(receiver.address, tokenZero);
      expect(refBalanceEth).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
      const refBalanceErc20 = await exchangeInstance
        .connect(receiver)
        .getBalance(receiver.address, erc20Instance.address);
      expect(refBalanceErc20).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );

      const tx1 = exchangeInstance.connect(receiver).withdrawReward(tokenZero);
      await expect(tx1).to.changeEtherBalance(
        receiver,
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );

      const tx2 = exchangeInstance.connect(receiver).withdrawReward(erc20Instance.address);
      await expect(tx2).to.changeTokenBalance(
        erc20Instance,
        receiver,
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
    });
  });
});

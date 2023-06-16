import { expect } from "chai";
import { ethers } from "hardhat";
import { randomBytes, WeiPerEther, ZeroAddress } from "ethers";

import { blockAwait } from "@gemunion/contracts-utils";
import { nonce } from "@gemunion/contracts-constants";

import { amountWei, extra, templateId, tokenZero } from "../constants";
import { factoryDeployErc721 } from "./shared/factoryDeployErc721";
import { factoryDeployErc20 } from "./shared/factoryDeployErc20";
import { deployContractManager, deployExchangeFixture } from "./shared/fixture";

describe("Factory Exchange Referral", function () {
  const refProgram = {
    maxRefs: 10n,
    refReward: 10n * 100n, // 10.00 %
    // refReward: 3 * 100, // 3.00 %
    // refReward: 12 * 100, // 12.00 %
    // refReward: 550, // 5.5 %
    // refDecrease: 5, // 10% - 2% - 0.4% - 0.08% etc.
    refDecrease: 10n, // 10% - 1% - 0.1% - 0.01% etc.
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

      const tx = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward * 20n, refProgram.refDecrease);
      await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "LimitExceed");
    });

    it("should fail: program already set", async function () {
      const { contractInstance: exchangeInstance } = await deployExchangeFixture();

      const tx = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);
      const tx1 = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "RefProgramSet");
    });
  });

  describe("Deploy, Purchase, Referral", function () {
    it("should Purchase without Reward (zero ref)", async function () {
      const [owner] = await ethers.getSigners();

      const { contractInstance: exchangeInstance, generateOneToManySignature } = await deployExchangeFixture();
      const factoryInstance = await deployContractManager(exchangeInstance);
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance);
      const address = await erc721Instance.getAddress();

      const signature = await generateOneToManySignature({
        account: owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: ZeroAddress,
          extra,
        },
        item: {
          tokenType: 2,
          token: address,
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
          referrer: ZeroAddress,
          extra,
        },
        {
          // ERC721
          tokenType: 2,
          token: address,
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
        { value: amountWei },
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
          extra,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: WeiPerEther,
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
          extra,
        },
        {
          // ERC721
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature,
        { value: WeiPerEther },
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
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
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
          extra,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: WeiPerEther,
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
          extra,
        },
        {
          // ERC721
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature,
        { value: WeiPerEther },
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
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );

      await blockAwait();

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);

      const nonce1 = randomBytes(32);
      const signature1 = await generateOneToManySignature({
        account: stranger.address,
        params: {
          nonce: nonce1,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: owner.address,
          extra,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: WeiPerEther,
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
          extra,
        },
        {
          // ERC721
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature1,
        { value: WeiPerEther },
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
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );

      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          receiver.address,
          1,
          tokenZero,
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 1n,
        );

      const balance1 = await erc721Instance.balanceOf(stranger.address);
      expect(balance1).to.equal(1);

      const nonce2 = randomBytes(32);
      const signature2 = await generateOneToManySignature({
        account: receiver.address,
        params: {
          nonce: nonce2,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: stranger.address,
          extra,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: WeiPerEther,
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
          extra,
        },
        {
          // ERC721
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature2,
        { value: WeiPerEther },
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
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );

      await expect(tx2)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          owner.address,
          1,
          tokenZero,
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 1n,
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
      await expect(tx).to.be.revertedWithCustomError(exchangeInstance, "BalanceExceed");
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
          extra,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: WeiPerEther,
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
          extra,
        },
        {
          // ERC721
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature,
        { value: WeiPerEther },
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
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );

      await blockAwait();

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);

      const nonce1 = randomBytes(32);
      const signature1 = await generateOneToManySignature({
        account: stranger.address,
        params: {
          nonce: nonce1,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: owner.address,
          extra,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: WeiPerEther,
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
          extra,
        },
        {
          // ERC721
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature1,
        { value: WeiPerEther },
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
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );
      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          receiver.address,
          1,
          tokenZero,
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 1n,
        );

      const balance1 = await erc721Instance.balanceOf(stranger.address);
      expect(balance1).to.equal(1);

      const nonce2 = randomBytes(32);
      const signature2 = await generateOneToManySignature({
        account: receiver.address,
        params: {
          nonce: nonce2,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: stranger.address,
          extra,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: WeiPerEther,
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
          extra,
        },
        {
          // ERC721
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature2,
        { value: WeiPerEther },
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
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );

      await expect(tx2)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          owner.address,
          1,
          tokenZero,
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 1n,
        );

      const balance2 = await erc721Instance.balanceOf(receiver.address);
      expect(balance2).to.equal(1);

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(5);

      const ownerRefBalance = await exchangeInstance.getBalance(owner.address, tokenZero);
      expect(ownerRefBalance).to.equal(
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n +
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 1n,
      );
      const receiverRefBalance = await exchangeInstance.getBalance(receiver.address, tokenZero);
      expect(receiverRefBalance).to.equal(
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n +
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 1n,
      );
      const strangerRefBalance = await exchangeInstance.getBalance(stranger.address, tokenZero);
      expect(strangerRefBalance).to.equal(
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
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
          extra,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: WeiPerEther,
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
          extra,
        },
        {
          // ERC721
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        signature,
        { value: WeiPerEther },
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
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(1);

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);

      const refBalance = await exchangeInstance.connect(receiver).getBalance(receiver.address, tokenZero);
      expect(refBalance).to.equal(
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
      );

      const tx1 = exchangeInstance.connect(receiver).withdrawReward(tokenZero);
      await expect(tx1).to.changeEtherBalance(
        receiver,
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
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
      const tenEth = WeiPerEther * 10n;
      await erc20Instance.mint(owner.address, tenEth);
      const ownerErc20Balance = await erc20Instance.balanceOf(owner.address);
      expect(ownerErc20Balance).to.equal(tenEth);
      // SET ALLOWANCE FOR EXCHANGE
      await erc20Instance.approve(await exchangeInstance.getAddress(), WeiPerEther);
      const allowance = await erc20Instance.allowance(owner.address, await exchangeInstance.getAddress());
      expect(allowance).to.equal(WeiPerEther);

      const signature = await generateOneToManySignature({
        account: owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: receiver.address,
          extra,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId: 0,
            amount: WeiPerEther,
          },
        ],
      });

      const tx = exchangeInstance.connect(owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: receiver.address,
          extra,
        },
        {
          // ERC721
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        [
          // ERC20
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId: 0,
            amount: WeiPerEther,
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
          await erc20Instance.getAddress(),
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);

      const refBalanceEth = await exchangeInstance.connect(receiver).getBalance(receiver.address, tokenZero);
      expect(refBalanceEth).to.equal(0);
      const refBalanceErc20 = await exchangeInstance
        .connect(receiver)
        .getBalance(receiver.address, await erc20Instance.getAddress());
      expect(refBalanceErc20).to.equal(
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
      );

      const tx1 = exchangeInstance.connect(receiver).withdrawReward(await erc20Instance.getAddress());

      await expect(tx1).to.changeTokenBalance(
        erc20Instance,
        receiver,
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
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
      const tenEth = WeiPerEther * 10n;
      await erc20Instance.mint(owner.address, tenEth);
      const ownerErc20Balance = await erc20Instance.balanceOf(owner.address);
      expect(ownerErc20Balance).to.equal(tenEth);
      // SET ALLOWANCE FOR EXCHANGE
      await erc20Instance.approve(await exchangeInstance.getAddress(), WeiPerEther);
      const allowance = await erc20Instance.allowance(owner.address, await exchangeInstance.getAddress());
      expect(allowance).to.equal(WeiPerEther);

      const signature = await generateOneToManySignature({
        account: owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: receiver.address,
          extra,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId: 0,
            amount: WeiPerEther,
          },
        ],
      });

      const tx = exchangeInstance.connect(owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: receiver.address,
          extra,
        },
        {
          // ERC721
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: templateId,
          amount: 1,
        },
        [
          {
            amount: WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId: 0,
            amount: WeiPerEther,
          },
        ],
        signature,
        { value: WeiPerEther },
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
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );

      await expect(tx) // ERC20 reward
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          owner.address, // buyer
          receiver.address, // referrer
          0, // level
          await erc20Instance.getAddress(),
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(1);

      const refBalanceEth = await exchangeInstance.connect(receiver).getBalance(receiver.address, tokenZero);
      expect(refBalanceEth).to.equal(
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
      );
      const refBalanceErc20 = await exchangeInstance
        .connect(receiver)
        .getBalance(receiver.address, await erc20Instance.getAddress());
      expect(refBalanceErc20).to.equal(
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
      );

      const tx1 = exchangeInstance.connect(receiver).withdrawReward(tokenZero);
      await expect(tx1).to.changeEtherBalance(
        receiver,
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
      );

      const tx2 = exchangeInstance.connect(receiver).withdrawReward(await erc20Instance.getAddress());
      await expect(tx2).to.changeTokenBalance(
        erc20Instance,
        receiver,
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
      );
    });
  });
});

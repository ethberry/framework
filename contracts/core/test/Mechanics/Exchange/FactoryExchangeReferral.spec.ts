import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { constants, ContractFactory, utils } from "ethers";
import { Network } from "@ethersproject/networks";

import { ContractManager, Exchange } from "../../../typechain-types";
import { amountWei, amountWeiEth, nonce, templateId, tokenName, tokenZero } from "../../constants";
import { wrapOneToManySignature } from "./shared/utils";
import { blockAwait } from "../../../scripts/utils/blockAwait";
import { factoryDeploy } from "./shared/factoryDeploy";

use(solidity);

describe("Factory Exchange Referral", function () {
  let factory: ContractFactory;
  let factoryInstance: ContractManager;
  let exchangeInstance: Exchange;
  let network: Network;
  let generateSignature: (values: Record<string, any>) => Promise<string>;

  beforeEach(async function () {
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();
    network = await ethers.provider.getNetwork();

    factory = await ethers.getContractFactory("ContractManager");
    factoryInstance = (await factory.deploy()) as ContractManager;
    await factoryInstance.deployed();

    const exchangeFactory = await ethers.getContractFactory("Exchange");
    exchangeInstance = await exchangeFactory.deploy(tokenName);
    if (network.chainId === 1337) await blockAwait();
    generateSignature = wrapOneToManySignature(network, exchangeInstance, this.owner);

    const minters = [exchangeInstance.address];
    const metadata = [exchangeInstance.address];
    await factoryInstance.setFactories(
      // minters
      minters,
      // metadata editors
      metadata,
    );

    this.contractInstance = factoryInstance;
  });

  describe("Deploy and Purchase", function () {
    it("should Purchase without Reward (zero ref)", async function () {
      // FACTORY DEPLOY
      const erc721Instance = await factoryDeploy(factoryInstance, exchangeInstance.address);

      const signature = await generateSignature({
        account: this.owner.address,
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

      const tx1 = exchangeInstance.connect(this.owner).purchase(
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
        this.owner.address,
        signature,
        { value: amountWeiEth },
      );
      await expect(tx1).to.emit(exchangeInstance, "Purchase").to.not.emit(exchangeInstance, "ReferralReward");
      if (network.chainId === 1337) await blockAwait();
      await expect(tx1).to.emit(erc721Instance, "Transfer");

      const balance = await erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should Purchase with Reward (one ref)", async function () {
      // FACTORY DEPLOY
      const erc721Instance = await factoryDeploy(factoryInstance, exchangeInstance.address);

      const signature = await generateSignature({
        account: this.owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: this.stranger.address,
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

      const tx1 = exchangeInstance.connect(this.owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: this.stranger.address,
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
        this.owner.address,
        signature,
        { value: amountWeiEth },
      );
      await expect(tx1).to.emit(exchangeInstance, "Purchase");
      if (network.chainId === 1337) await blockAwait();
      await expect(tx1).to.emit(erc721Instance, "Transfer");
      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(this.owner.address, this.stranger.address, 0, constants.WeiPerEther);

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(1);

      const balance = await erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should Purchase with Reward (multi ref)", async function () {
      // FACTORY DEPLOY
      const erc721Instance = await factoryDeploy(factoryInstance, exchangeInstance.address);

      const signature = await generateSignature({
        account: this.owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: this.receiver.address,
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
      const tx = exchangeInstance.connect(this.owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: this.receiver.address,
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
        this.owner.address,
        signature,
        { value: amountWeiEth },
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");
      await expect(tx).to.emit(erc721Instance, "Transfer");
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(this.owner.address, this.receiver.address, 0, constants.WeiPerEther);
      if (network.chainId === 1337) await blockAwait();
      const balance = await erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);

      const nonce1 = utils.randomBytes(32);
      const signature1 = await generateSignature({
        account: this.stranger.address,
        params: {
          nonce: nonce1,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: this.owner.address,
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
      const tx1 = exchangeInstance.connect(this.stranger).purchase(
        {
          nonce: nonce1,
          externalId: templateId,
          expiresAt: 0,
          referrer: this.owner.address,
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
        this.owner.address,
        signature1,
        { value: amountWeiEth },
      );
      await expect(tx1).to.emit(exchangeInstance, "Purchase");
      await expect(tx1).to.emit(erc721Instance, "Transfer");
      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(this.stranger.address, this.owner.address, 0, constants.WeiPerEther);
      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(this.stranger.address, this.receiver.address, 1, constants.WeiPerEther.div(10));
      const balance1 = await erc721Instance.balanceOf(this.stranger.address);
      expect(balance1).to.equal(1);

      const nonce2 = utils.randomBytes(32);
      const signature2 = await generateSignature({
        account: this.receiver.address,
        params: {
          nonce: nonce2,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: this.stranger.address,
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
      const tx2 = exchangeInstance.connect(this.receiver).purchase(
        {
          nonce: nonce2,
          externalId: templateId,
          expiresAt: 0,
          referrer: this.stranger.address,
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
        this.owner.address,
        signature2,
        { value: amountWeiEth },
      );
      await expect(tx2).to.emit(exchangeInstance, "Purchase");
      await expect(tx2).to.emit(erc721Instance, "Transfer");
      await expect(tx2)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(this.receiver.address, this.stranger.address, 0, constants.WeiPerEther);
      await expect(tx2)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(this.receiver.address, this.owner.address, 1, constants.WeiPerEther.div(10));
      const balance2 = await erc721Instance.balanceOf(this.receiver.address);
      expect(balance2).to.equal(1);

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(5);
    });
  });

  describe("Balance Withdraw", function () {
    it("should fail: Insufficient balance", async function () {
      // FACTORY DEPLOY
      const erc721Instance = await factoryDeploy(factoryInstance, exchangeInstance.address);

      const signature = await generateSignature({
        account: this.owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: this.receiver.address,
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

      const tx = exchangeInstance.connect(this.owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: this.receiver.address,
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
        this.owner.address,
        signature,
        { value: amountWeiEth },
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");
      if (network.chainId === 1337) await blockAwait();
      await expect(tx).to.emit(erc721Instance, "Transfer");
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(this.owner.address, this.receiver.address, 0, constants.WeiPerEther);

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(1);

      const balance = await erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);

      const refBalance = await exchangeInstance.getBalance(this.receiver.address);
      expect(refBalance).to.equal(constants.WeiPerEther);

      const tx1 = exchangeInstance.connect(this.receiver).withdraw();
      await expect(tx1).to.be.revertedWith("ExchangeReferral: Insufficient balance");
    });

    it("should fail: Zero balance", async function () {
      const tx = exchangeInstance.connect(this.receiver).withdraw();
      await expect(tx).to.be.revertedWith("ExchangeReferral: Zero balance");
    });

    it("should Withdraw referral Balance", async function () {
      // FACTORY DEPLOY
      const erc721Instance = await factoryDeploy(factoryInstance, exchangeInstance.address);

      const signature = await generateSignature({
        account: this.owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: this.receiver.address,
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

      const tx = exchangeInstance.connect(this.owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: this.receiver.address,
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
        this.owner.address,
        signature,
        { value: amountWeiEth },
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");
      if (network.chainId === 1337) await blockAwait();
      await expect(tx).to.emit(erc721Instance, "Transfer");
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(this.owner.address, this.receiver.address, 0, constants.WeiPerEther);

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(1);

      const balance = await erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);

      const refBalance = await exchangeInstance.getBalance(this.receiver.address);
      expect(refBalance).to.equal(constants.WeiPerEther);
      await this.owner.sendTransaction({
        to: exchangeInstance.address,
        value: ethers.constants.WeiPerEther.mul(2),
      });
      if (network.chainId === 1337) await blockAwait();

      const tx1 = exchangeInstance.connect(this.receiver).withdraw();
      await expect(tx1).to.changeEtherBalance(this.receiver, constants.WeiPerEther);
    });
  });
});

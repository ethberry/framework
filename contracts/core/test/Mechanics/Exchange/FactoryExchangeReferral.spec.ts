import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { constants, ContractFactory, utils } from "ethers";
import { Network } from "@ethersproject/networks";

import { ContractManager, Exchange } from "../../../typechain-types";
import { amountWei, amountWeiEth, nonce, templateId, tokenName, tokenZero } from "../../constants";
import { wrapOneToManySignature } from "./shared/utils";
import { blockAwait } from "../../../scripts/utils/blockAwait";
import { factoryDeployErc721 } from "./shared/factoryDeployErc721";
import { factoryDeployErc20 } from "./shared/FactoryDeployErc20";

use(solidity);

describe("Factory Exchange Referral", function () {
  let factory: ContractFactory;
  let factoryInstance: ContractManager;
  let exchangeInstance: Exchange;
  let network: Network;
  let generateSignature: (values: Record<string, any>) => Promise<string>;

  const refProgram = {
    maxRefs: 10,
    refReward: 10 * 100, // 10.00 %
    // refReward: 3 * 100, // 3.00 %
    // refReward: 12 * 100, // 12.00 %
    // refReward: 550, // 5.5 %
    // refDecrease: 5, // 10% - 2% - 0.4% - 0.08% etc.
    refDecrease: 10, // 10% - 1% - 0.1% - 0.01% etc.
  };

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

  describe("Referral program", function () {
    it("should set Ref program", async function () {
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
      const tx = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward * 20, refProgram.refDecrease);
      await expect(tx).to.be.revertedWith("ExchangeReferral: wrong refReward");
    });

    it("should fail: program already set", async function () {
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
      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance.address);

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
      // SET REF PROGRAM
      const tx = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance.address);
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
            amount: constants.WeiPerEther,
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
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        this.owner.address,
        signature,
        { value: constants.WeiPerEther },
      );
      await expect(tx1).to.emit(exchangeInstance, "Purchase");
      if (network.chainId === 1337) await blockAwait();
      await expect(tx1).to.emit(erc721Instance, "Transfer");

      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.owner.address,
          this.stranger.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      const balance = await erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should Purchase with Reward (multi ref)", async function () {
      // SET REF PROGRAM
      const tx0 = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx0)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance.address);

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
            amount: constants.WeiPerEther,
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
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        this.owner.address,
        signature,
        { value: constants.WeiPerEther },
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");
      await expect(tx).to.emit(erc721Instance, "Transfer");

      await expect(tx)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.owner.address,
          this.receiver.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

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
            amount: constants.WeiPerEther,
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
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        this.owner.address,
        signature1,
        { value: constants.WeiPerEther },
      );
      await expect(tx1).to.emit(exchangeInstance, "Purchase");
      await expect(tx1).to.emit(erc721Instance, "Transfer");

      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.stranger.address,
          this.owner.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );
      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.stranger.address,
          this.receiver.address,
          1,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        );

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
            amount: constants.WeiPerEther,
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
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        this.owner.address,
        signature2,
        { value: constants.WeiPerEther },
      );
      await expect(tx2).to.emit(exchangeInstance, "Purchase");
      await expect(tx2).to.emit(erc721Instance, "Transfer");
      await expect(tx2)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.receiver.address,
          this.stranger.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      await expect(tx2)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.receiver.address,
          this.owner.address,
          1,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        );

      const balance2 = await erc721Instance.balanceOf(this.receiver.address);
      expect(balance2).to.equal(1);

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(5);
    });
  });

  describe("Balance Withdraw", function () {
    it("should fail: Zero balance", async function () {
      const tx = exchangeInstance.connect(this.receiver).withdrawReward(tokenZero);
      await expect(tx).to.be.revertedWith("ExchangeReferral: Zero balance");
    });

    it("should get referral Reward Balances", async function () {
      // SET REF PROGRAM
      const tx0 = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx0)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance.address);

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
            amount: constants.WeiPerEther,
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
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        this.owner.address,
        signature,
        { value: constants.WeiPerEther },
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");
      await expect(tx).to.emit(erc721Instance, "Transfer");

      await expect(tx)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.owner.address,
          this.receiver.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

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
            amount: constants.WeiPerEther,
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
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        this.owner.address,
        signature1,
        { value: constants.WeiPerEther },
      );
      await expect(tx1).to.emit(exchangeInstance, "Purchase");
      await expect(tx1).to.emit(erc721Instance, "Transfer");

      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.stranger.address,
          this.owner.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );
      await expect(tx1)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.stranger.address,
          this.receiver.address,
          1,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        );

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
            amount: constants.WeiPerEther,
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
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        this.owner.address,
        signature2,
        { value: constants.WeiPerEther },
      );
      await expect(tx2).to.emit(exchangeInstance, "Purchase");
      await expect(tx2).to.emit(erc721Instance, "Transfer");
      await expect(tx2)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.receiver.address,
          this.stranger.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      await expect(tx2)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.receiver.address,
          this.owner.address,
          1,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        );

      const balance2 = await erc721Instance.balanceOf(this.receiver.address);
      expect(balance2).to.equal(1);

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(5);

      const ownerRefBalance = await exchangeInstance.getBalance(this.owner.address, tokenZero);
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
      const receiverRefBalance = await exchangeInstance.getBalance(this.receiver.address, tokenZero);
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
      const strangerRefBalance = await exchangeInstance.getBalance(this.stranger.address, tokenZero);
      expect(strangerRefBalance).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
    });

    it("should withdraw referral Reward ETH (one)", async function () {
      // SET REF PROGRAM
      const tx0 = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx0)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance.address);

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
            amount: constants.WeiPerEther,
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
            amount: constants.WeiPerEther,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        this.owner.address,
        signature,
        { value: constants.WeiPerEther },
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");
      if (network.chainId === 1337) await blockAwait();
      await expect(tx).to.emit(erc721Instance, "Transfer");
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.owner.address, // buyer
          this.receiver.address, // referrer
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(1);

      const balance = await erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);

      const refBalance = await exchangeInstance.connect(this.receiver).getBalance(this.receiver.address, tokenZero);
      expect(refBalance).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );

      const tx1 = exchangeInstance.connect(this.receiver).withdrawReward(tokenZero);
      await expect(tx1).to.changeEtherBalance(
        this.receiver,
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
    });

    it("should withdraw referral Reward ERC20 (one)", async function () {
      // SET REF PROGRAM
      const tx0 = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx0)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance.address);
      const erc20Instance = await factoryDeployErc20(factoryInstance, exchangeInstance.address);
      // MINT ERC20
      const tenEth = constants.WeiPerEther.mul(10);
      await erc20Instance.mint(this.owner.address, tenEth);
      const ownerErc20Balance = await erc20Instance.balanceOf(this.owner.address);
      expect(ownerErc20Balance).to.equal(tenEth);
      // SET ALLOWANCE FOR EXCHANGE
      await erc20Instance.approve(exchangeInstance.address, constants.WeiPerEther);
      const allowance = await erc20Instance.allowance(this.owner.address, exchangeInstance.address);
      expect(allowance).to.equal(constants.WeiPerEther);

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
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount: constants.WeiPerEther,
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
          // ERC20
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount: constants.WeiPerEther,
          },
        ],
        this.owner.address,
        signature,
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");
      if (network.chainId === 1337) await blockAwait();
      await expect(tx).to.emit(erc721Instance, "Transfer");
      await expect(tx).to.emit(erc20Instance, "Transfer");
      await expect(tx)
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.owner.address, // buyer
          this.receiver.address, // referrer
          0, // level
          erc20Instance.address,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      const balance = await erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);

      const refBalanceEth = await exchangeInstance.connect(this.receiver).getBalance(this.receiver.address, tokenZero);
      expect(refBalanceEth).to.equal(0);
      const refBalanceErc20 = await exchangeInstance
        .connect(this.receiver)
        .getBalance(this.receiver.address, erc20Instance.address);
      expect(refBalanceErc20).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );

      const tx1 = exchangeInstance.connect(this.receiver).withdrawReward(erc20Instance.address);

      await expect(tx1).to.changeTokenBalance(
        erc20Instance,
        this.receiver,
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
    });

    it("should withdraw referral Rewards ETH and ERC20", async function () {
      // SET REF PROGRAM
      const tx0 = exchangeInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx0)
        .to.emit(exchangeInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      // FACTORY DEPLOY
      const erc721Instance = await factoryDeployErc721(factoryInstance, exchangeInstance.address);
      const erc20Instance = await factoryDeployErc20(factoryInstance, exchangeInstance.address);
      // MINT ERC20
      const tenEth = constants.WeiPerEther.mul(10);
      await erc20Instance.mint(this.owner.address, tenEth);
      const ownerErc20Balance = await erc20Instance.balanceOf(this.owner.address);
      expect(ownerErc20Balance).to.equal(tenEth);
      // SET ALLOWANCE FOR EXCHANGE
      await erc20Instance.approve(exchangeInstance.address, constants.WeiPerEther);
      const allowance = await erc20Instance.allowance(this.owner.address, exchangeInstance.address);
      expect(allowance).to.equal(constants.WeiPerEther);

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
        this.owner.address,
        signature,
        { value: constants.WeiPerEther },
      );
      await expect(tx).to.emit(exchangeInstance, "Purchase");
      if (network.chainId === 1337) await blockAwait();
      await expect(tx).to.emit(erc20Instance, "Transfer");
      await expect(tx).to.emit(erc721Instance, "Transfer");

      await expect(tx) // ETH reward
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.owner.address,
          this.receiver.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      await expect(tx) // ERC20 reward
        .to.emit(exchangeInstance, "ReferralReward")
        .withArgs(
          this.owner.address, // buyer
          this.receiver.address, // referrer
          0, // level
          erc20Instance.address,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      const balance = await erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);

      const refBalanceEth = await exchangeInstance.connect(this.receiver).getBalance(this.receiver.address, tokenZero);
      expect(refBalanceEth).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
      const refBalanceErc20 = await exchangeInstance
        .connect(this.receiver)
        .getBalance(this.receiver.address, erc20Instance.address);
      expect(refBalanceErc20).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );

      const tx1 = exchangeInstance.connect(this.receiver).withdrawReward(tokenZero);
      await expect(tx1).to.changeEtherBalance(
        this.receiver,
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );

      const tx2 = exchangeInstance.connect(this.receiver).withdrawReward(erc20Instance.address);
      await expect(tx2).to.changeTokenBalance(
        erc20Instance,
        this.receiver,
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
    });
  });
});

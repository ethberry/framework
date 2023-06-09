import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber, constants, utils } from "ethers";

import { amount, MINTER_ROLE } from "@gemunion/contracts-constants";

import { expiresAt, extra, params } from "../constants";
import { deployExchangeFixture } from "./shared/fixture";
import { getContractName, isEqualEventArgObj } from "../utils";
import { deployERC20 } from "../ERC20/shared/fixtures";
import { deployERC721 } from "../ERC721/shared/fixtures";

describe("ExchangeLottery", function () {
  describe("Lottery", function () {
    describe("Purchase", function () {
      it("should purchase lottery ticket", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          maxTickets: 2, // production: 5000 (dev: 2)
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2,
            token: erc721TicketInstance.address,
            tokenId: 1,
            amount,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
        );

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
        await erc721TicketInstance.grantRole(MINTER_ROLE, lotteryInstance.address);

        const signature = await generateOneToOneSignature({
          account: receiver.address,
          params: {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0, // wtf?
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          item: {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          price: {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
        });
        const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
          signature,
        );
        // event PurchaseLottery(address account, Asset item, Asset price, uint256 round, bytes32 numbers);
        await expect(tx1)
          .to.emit(exchangeInstance, "PurchaseLottery")
          .withArgs(
            receiver.address,
            isEqualEventArgObj({
              tokenType: 2,
              token: erc721TicketInstance.address,
              tokenId: BigNumber.from(1), // ticketId = 1
              amount: BigNumber.from(1),
            }),
            isEqualEventArgObj({
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: BigNumber.from(121),
              amount: BigNumber.from(amount),
            }),
            BigNumber.from(1),
            params.extra,
          );

        const balance = await erc20Instance.balanceOf(lotteryInstance.address);
        expect(balance).to.equal(BigNumber.from(amount));
      });

      it("should fail: wrong price", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          maxTickets: 2, // production: 5000 (dev: 2)
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2,
            token: erc721TicketInstance.address,
            tokenId: 1,
            amount,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 122,
            amount,
          },
        );

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
        await erc721TicketInstance.grantRole(MINTER_ROLE, lotteryInstance.address);

        const signature = await generateOneToOneSignature({
          account: receiver.address,
          params: {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0, // wtf?
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          item: {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          price: {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
        });
        const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "WrongPrice");
      });

      it("should fail: wrong signer", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          maxTickets: 2, // production: 5000 (dev: 2)
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2,
            token: erc721TicketInstance.address,
            tokenId: 1,
            amount,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
        );

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
        await erc721TicketInstance.grantRole(MINTER_ROLE, lotteryInstance.address);

        const signature = await generateOneToOneSignature({
          account: receiver.address,
          params: {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 1, // wtf?
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          item: {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          price: {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
        });
        const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
          signature,
        );

        await expect(tx1).to.be.revertedWithCustomError(exchangeInstance, "SignerMissingRole");
      });

      it("should fail: wrong signature", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance /* generateOneToOneSignature */ } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          maxTickets: 2, // production: 5000 (dev: 2)
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2,
            token: erc721TicketInstance.address,
            tokenId: 1,
            amount,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
        );

        const signature = utils.formatBytes32String("signature");

        const tx = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
          signature,
        );
        await expect(tx).to.be.revertedWith("ECDSA: invalid signature length");
      });

      it("should fail: expired signature", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          maxTickets: 2, // production: 5000 (dev: 2)
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2,
            token: erc721TicketInstance.address,
            tokenId: 1,
            amount,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
        );

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
        await erc721TicketInstance.grantRole(MINTER_ROLE, lotteryInstance.address);

        const signature = await generateOneToOneSignature({
          account: receiver.address,
          params: {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0, // wtf?
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          item: {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          price: {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
        });
        const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
          signature,
        );
        // event PurchaseLottery(address account, Asset item, Asset price, uint256 round, bytes32 numbers);
        await expect(tx1)
          .to.emit(exchangeInstance, "PurchaseLottery")
          .withArgs(
            receiver.address,
            isEqualEventArgObj({
              tokenType: 2,
              token: erc721TicketInstance.address,
              tokenId: BigNumber.from(1), // ticketId = 1
              amount: BigNumber.from(1),
            }),
            isEqualEventArgObj({
              tokenType: 1,
              token: erc20Instance.address,
              tokenId: BigNumber.from(121),
              amount: BigNumber.from(amount),
            }),
            BigNumber.from(1),
            params.extra,
          );

        const tx2 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
          signature,
        );
        await expect(tx2).to.be.revertedWithCustomError(exchangeInstance, "ExpiredSignature");
      });

      it("should fail: insufficient allowance", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          maxTickets: 2, // production: 5000 (dev: 2)
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2,
            token: erc721TicketInstance.address,
            tokenId: 1,
            amount,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
        );

        await erc20Instance.mint(receiver.address, amount);
        // await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
        await erc721TicketInstance.grantRole(MINTER_ROLE, lotteryInstance.address);

        const signature = await generateOneToOneSignature({
          account: receiver.address,
          params: {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0, // wtf?
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          item: {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          price: {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
        });
        const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
          signature,
        );
        await expect(tx1).to.be.revertedWith("ERC20: insufficient allowance");
      });

      it("should fail: transfer amount exceeds balance", async function () {
        const [_owner, receiver] = await ethers.getSigners();
        const { contractInstance: exchangeInstance, generateOneToOneSignature } = await deployExchangeFixture();

        const erc20Instance = await deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
        const erc721TicketInstance = await deployERC721("ERC721LotteryTicket");

        const factory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));
        const lotteryConfig = {
          timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
          maxTickets: 2, // production: 5000 (dev: 2)
          commission: 30, // lottery wallet gets 30% commission from each round balance
        };
        const lotteryInstance = await factory.deploy(lotteryConfig);
        await lotteryInstance.startRound(
          {
            tokenType: 2,
            token: erc721TicketInstance.address,
            tokenId: 1,
            amount,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
        );

        await erc20Instance.mint(receiver.address, 1);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
        await erc721TicketInstance.grantRole(MINTER_ROLE, lotteryInstance.address);

        const signature = await generateOneToOneSignature({
          account: receiver.address,
          params: {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0, // wtf?
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          item: {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          price: {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
        });
        const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
          {
            nonce: utils.formatBytes32String("nonce"),
            externalId: 0,
            expiresAt,
            referrer: constants.AddressZero,
            extra,
          },
          {
            tokenType: 0,
            token: lotteryInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 121,
            amount,
          },
          signature,
        );

        await expect(tx1).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      });
    });
  });
});

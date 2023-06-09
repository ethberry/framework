import { expect } from "chai";
import { ethers, network, web3 } from "hardhat";
import { BigNumber, constants, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { amount, MINTER_ROLE, nonce, tokenName } from "@gemunion/contracts-constants";

import { expiresAt, extra, params } from "../../constants";
import { deployLinkVrfFixture } from "../../shared/link";
import { IERC721Random, VRFCoordinatorMock } from "../../../typechain-types";
import { randomRequest } from "../../shared/randomRequest";
import { deployLottery } from "./fixture";
import { wrapOneToOneSignature } from "../../Exchange/shared/utils";
import { getNumbersBytes, isEqualEventArgObj } from "../../utils";

const delay = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

describe("Lottery", function () {
  let vrfInstance: VRFCoordinatorMock;

  const lotteryConfig = {
    timeLagBeforeRelease: 100, // production: release after 2592000 seconds = 30 days
    maxTickets: 2, // production: 5000 (dev: 2)
    commission: 30, // lottery wallet gets 30% commission from each round balance
  };

  const factory = () => deployLottery(lotteryConfig);

  before(async function () {
    if (network.name === "hardhat") {
      await network.provider.send("hardhat_reset");

      // https://github.com/NomicFoundation/hardhat/issues/2980
      ({ vrfInstance } = await loadFixture(function chainlink() {
        return deployLinkVrfFixture();
      }));
    }
  });

  // shouldBehaveLikeAccessControl(async () => {
  //   const { lotteryInstance } = await factory();
  //   return lotteryInstance;
  // })(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  //
  // shouldBehaveLikePausable(async () => {
  //   const { lotteryInstance } = await factory();
  //   return lotteryInstance;
  // });

  describe("Start Round", function () {
    it("should start new round", async function () {
      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();
      const tx = await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      );
      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(lotteryInstance, "RoundStarted").withArgs(1, current);
    });

    it("should fail: not yet finished", async function () {
      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();
      lotteryInstance.startRound(
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      );
      const tx = lotteryInstance.startRound(
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      );
      await expect(tx).to.be.revertedWithCustomError(lotteryInstance, "NotComplete");
    });
  });

  describe("Finish Round", function () {
    it("should end current round", async function () {
      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();
      await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      );

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, lotteryInstance.address);
      }

      const tx = await lotteryInstance.endRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(lotteryInstance, "RoundEnded").withArgs(1, current);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      if (network.name === "hardhat") {
        await randomRequest(lotteryInstance as IERC721Random, vrfInstance);
      }
    });

    it("should fail: previous round is already finished", async function () {
      const { lotteryInstance } = await factory();
      const tx = lotteryInstance.endRound();
      await expect(tx).to.be.revertedWithCustomError(lotteryInstance, "NotActive");
    });

    it.skip("should fail: wrong round ID", async function () {
      const { lotteryInstance } = await factory();
      const tx = lotteryInstance.endRound();
      await expect(tx).to.be.revertedWithCustomError(lotteryInstance, "WrongRound");
    });
  });

  describe("Purchase Lottery", function () {
    it("should finish round with 1 ticket and release funds", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();

      const exchangeFactory = await ethers.getContractFactory("Exchange");
      const exchangeInstance = await exchangeFactory.deploy(tokenName, [owner.address], [100]);

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

      await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, lotteryInstance.address);
      }
      await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      );

      // BUY TICKET @EXCHANGE
      const networkE = await ethers.provider.getNetwork();
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, owner);

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
          tokenId: 0,
          amount,
        },
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
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
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx0)
        .to.emit(exchangeInstance, "PurchaseLottery")
        .withArgs(
          receiver.address,
          isEqualEventArgObj({
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: BigNumber.from(1), // ticketId = 1
            amount: BigNumber.from(1),
          }),
          isEqualEventArgObj({
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: BigNumber.from(0),
            amount: BigNumber.from(amount),
          }),
          BigNumber.from(1),
          params.extra,
        );
      await expect(tx0).changeTokenBalances(erc20Instance, [receiver, lotteryInstance], [-amount, amount]);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      const tx = await lotteryInstance.endRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(lotteryInstance, "RoundEnded").withArgs(1, current);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      if (network.name === "hardhat") {
        // RANDOM
        await randomRequest(lotteryInstance as IERC721Random, vrfInstance);
      } else {
        const eventFilter = lotteryInstance.filters.RoundFinalized();
        const events = await lotteryInstance.queryFilter(eventFilter);
        expect(events.length).to.be.greaterThan(0);
        expect(events[0].args?.round).to.equal(1);
      }

      // WAIT for RELEASE
      const latest = await time.latestBlock();
      await time.advanceBlockTo(latest.add(web3.utils.toBN(lotteryConfig.timeLagBeforeRelease + 1)));

      const tx1 = lotteryInstance.releaseFunds(1);
      await expect(tx1).to.emit(lotteryInstance, "Released").withArgs(1, amount);
      await expect(tx1).changeTokenBalances(erc20Instance, [owner, lotteryInstance], [amount, -amount]);
    });

    it("should fail: is not releasable yet", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();

      const exchangeFactory = await ethers.getContractFactory("Exchange");
      const exchangeInstance = await exchangeFactory.deploy(tokenName, [owner.address], [100]);

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

      await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, lotteryInstance.address);
      }
      await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      );

      // BUY TICKET @EXCHANGE
      const networkE = await ethers.provider.getNetwork();
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, owner);

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
          tokenId: 0,
          amount,
        },
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
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
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx0)
        .to.emit(exchangeInstance, "PurchaseLottery")
        .withArgs(
          receiver.address,
          isEqualEventArgObj({
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: BigNumber.from(1), // ticketId = 1
            amount: BigNumber.from(1),
          }),
          isEqualEventArgObj({
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: BigNumber.from(0),
            amount: BigNumber.from(amount),
          }),
          BigNumber.from(1),
          params.extra,
        );
      await expect(tx0).changeTokenBalances(erc20Instance, [receiver, lotteryInstance], [-amount, amount]);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      const tx = await lotteryInstance.endRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(lotteryInstance, "RoundEnded").withArgs(1, current);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      if (network.name === "hardhat") {
        // RANDOM
        await randomRequest(lotteryInstance as IERC721Random, vrfInstance);
      } else {
        const eventFilter = lotteryInstance.filters.RoundFinalized();
        const events = await lotteryInstance.queryFilter(eventFilter);
        expect(events.length).to.be.greaterThan(0);
        expect(events[0].args?.round).to.equal(1);
      }

      // NO WAIT for RELEASE
      const tx1 = lotteryInstance.releaseFunds(1);
      await expect(tx1).to.be.revertedWithCustomError(lotteryInstance, "NotComplete");
    });

    it("should fail: zero balance", async function () {
      const { lotteryInstance } = await factory();

      // WAIT for RELEASE
      const latest = await time.latestBlock();
      await time.advanceBlockTo(latest.add(web3.utils.toBN(lotteryConfig.timeLagBeforeRelease + 1)));

      const tx1 = lotteryInstance.releaseFunds(0);
      await expect(tx1).to.be.revertedWithCustomError(lotteryInstance, "ZeroBalance");
    });

    it("should fail: no more tickets available", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();

      const exchangeFactory = await ethers.getContractFactory("Exchange");
      const exchangeInstance = await exchangeFactory.deploy(tokenName, [owner.address], [100]);

      await erc20Instance.mint(receiver.address, amount * 3);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount * 3);

      await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, lotteryInstance.address);
      }
      await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      );

      // BUY TICKET @EXCHANGE
      const networkE = await ethers.provider.getNetwork();
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, owner);

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
          tokenId: 0,
          amount,
        },
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
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
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx0)
        .to.emit(exchangeInstance, "PurchaseLottery")
        .withArgs(
          receiver.address,
          isEqualEventArgObj({
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: BigNumber.from(1), // ticketId = 1
            amount: BigNumber.from(1),
          }),
          isEqualEventArgObj({
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: BigNumber.from(0),
            amount: BigNumber.from(amount),
          }),
          BigNumber.from(1),
          params.extra,
        );
      await expect(tx0).changeTokenBalances(erc20Instance, [receiver, lotteryInstance], [-amount, amount]);

      const signature1 = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          nonce: utils.formatBytes32String("nonce1"),
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
          tokenId: 0,
          amount,
        },
      });
      const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: utils.formatBytes32String("nonce1"),
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
          tokenId: 0,
          amount,
        },
        signature1,
      );
      await expect(tx1)
        .to.emit(exchangeInstance, "PurchaseLottery")
        .withArgs(
          receiver.address,
          isEqualEventArgObj({
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: BigNumber.from(2), // ticketId = 1
            amount: BigNumber.from(1),
          }),
          isEqualEventArgObj({
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: BigNumber.from(0),
            amount: BigNumber.from(amount),
          }),
          BigNumber.from(1),
          params.extra,
        );
      await expect(tx1).changeTokenBalances(erc20Instance, [receiver, lotteryInstance], [-amount, amount]);

      const signature2 = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          nonce: utils.formatBytes32String("nonce2"),
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
          tokenId: 0,
          amount,
        },
      });
      const tx2 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: utils.formatBytes32String("nonce2"),
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
          tokenId: 0,
          amount,
        },
        signature2,
      );
      await expect(tx2).to.be.revertedWithCustomError(lotteryInstance, "LimitExceed");
    });

    it("should fail: current round is finished", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();

      const exchangeFactory = await ethers.getContractFactory("Exchange");
      const exchangeInstance = await exchangeFactory.deploy(tokenName, [owner.address], [100]);

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

      await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, lotteryInstance.address);
      }
      await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      );

      const tx0 = await lotteryInstance.endRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx0).to.emit(lotteryInstance, "RoundEnded").withArgs(1, current);

      // BUY TICKET @EXCHANGE
      const networkE = await ethers.provider.getNetwork();
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, owner);

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
          tokenId: 0,
          amount,
        },
      });

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
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx).to.be.revertedWithCustomError(lotteryInstance, "WrongRound");
    });
  });

  describe("get prize", function () {
    it("should get prize: Jackpot 1 ticket", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const values = [0, 1, 2, 3, 5, 8];
      const aggregation = [0, 0, 0, 0, 0, 0, 1];

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();

      const defNumbers = getNumbersBytes(values);
      await erc721Instance.mintTicket(receiver.address, 1, defNumbers);

      await erc20Instance.mint(lotteryInstance.address, utils.parseEther("20000"));

      await lotteryInstance.setDummyRound(
        defNumbers,
        values,
        aggregation,
        nonce,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: 0,
          amount,
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      );

      await erc721Instance.connect(receiver).approve(lotteryInstance.address, 1);

      const prizeAmount = constants.WeiPerEther.mul(7000).sub(180); // rounding error

      const tx = lotteryInstance.connect(receiver).getPrize(1);
      await expect(tx).to.emit(lotteryInstance, "Prize").withArgs(receiver.address, 1, prizeAmount);
    });

    it("should get prize: Jackpot 2 tickets", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const values = [0, 1, 2, 3, 5, 8];
      const aggregation = [0, 0, 0, 0, 0, 0, 2];

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();
      await erc20Instance.mint(lotteryInstance.address, utils.parseEther("20000"));

      const defNumbers = getNumbersBytes(values);
      await erc721Instance.mintTicket(receiver.address, 1, defNumbers);
      await erc721Instance.connect(receiver).approve(lotteryInstance.address, 1);

      await lotteryInstance.setDummyRound(
        defNumbers,
        values,
        aggregation,
        nonce,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: 0,
          amount,
        },
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 1,
          amount,
        },
      );

      const prizeAmount = constants.WeiPerEther.mul(3500).sub(200); // rounding error

      const tx = lotteryInstance.connect(receiver).getPrize(1);
      await expect(tx).to.emit(lotteryInstance, "Prize").withArgs(receiver.address, 1, prizeAmount);
    });
  });
});

import { expect } from "chai";
import { ethers, network, web3 } from "hardhat";
import { BigNumber, constants, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { shouldBehaveLikeAccessControl, shouldBehaveLikePausable } from "@gemunion/contracts-mocha";

import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, nonce, PAUSER_ROLE, tokenName } from "@gemunion/contracts-constants";

import { expiresAt, extra } from "../../constants";
import { deployLinkVrfFixture } from "../../shared/link";
import { IERC721Random, VRFCoordinatorMock } from "../../../typechain-types";
import { randomRequest } from "../../shared/randomRequest";
import { deployRaffle } from "./fixture";
import { wrapManyToManySignature } from "../../Exchange/shared/utils";
import { isEqualEventArgArrObj, isEqualEventArgObj } from "../../utils";

const delay = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

describe("Raffle", function () {
  let vrfInstance: VRFCoordinatorMock;

  const lotteryConfig = {
    timeLagBeforeRelease: 100, // production: release after 2592000 seconds = 30 days
    maxTickets: 2, // production: 5000 (dev: 2)
    commission: 30, // lottery wallet gets 30% commission from each round balance
  };

  const factory = () => deployRaffle(lotteryConfig);

  before(async function () {
    if (network.name === "hardhat") {
      await network.provider.send("hardhat_reset");

      // https://github.com/NomicFoundation/hardhat/issues/2980
      ({ vrfInstance } = await loadFixture(function chainlink() {
        return deployLinkVrfFixture();
      }));
    }
  });

  shouldBehaveLikeAccessControl(async () => {
    const { raffleInstance } = await factory();
    return raffleInstance;
  })(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  shouldBehaveLikePausable(async () => {
    const { raffleInstance } = await factory();
    return raffleInstance;
  });

  describe("Start Round", function () {
    it("should start new round", async function () {
      const { raffleInstance, erc20Instance, erc721Instance } = await factory();
      const tx = await raffleInstance.startRound(
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
        0, // maxTicket count
      );

      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(raffleInstance, "RoundStarted").withArgs(1, current);
    });

    it("should fail: not yet finished", async function () {
      const { raffleInstance, erc20Instance, erc721Instance } = await factory();
      raffleInstance.startRound(
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
        0, // maxTicket count
      );
      const tx = raffleInstance.startRound(
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
        0, // maxTicket count
      );
      await expect(tx).to.be.revertedWithCustomError(raffleInstance, "NotComplete");
    });
  });

  describe("Finish Round", function () {
    it("should end current round", async function () {
      const { raffleInstance, erc20Instance, erc721Instance } = await factory();
      await raffleInstance.startRound(
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
        0, // maxTicket count
      );

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, raffleInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, raffleInstance.address);
      }

      const tx = await raffleInstance.endRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(raffleInstance, "RoundEnded").withArgs(1, current);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      if (network.name === "hardhat") {
        await randomRequest(raffleInstance as IERC721Random, vrfInstance);
      }
    });

    it("should fail: previous round is already finished", async function () {
      const { raffleInstance } = await factory();
      const tx = raffleInstance.endRound();
      await expect(tx).to.be.revertedWithCustomError(raffleInstance, "NotActive");
    });
  });

  describe("Purchase Raffle", function () {
    it("should finish round with 1 ticket and release funds", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { raffleInstance, erc20Instance, erc721Instance } = await factory();

      const exchangeFactory = await ethers.getContractFactory("Exchange");
      const exchangeInstance = await exchangeFactory.deploy(tokenName, [owner.address], [100]);

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

      await raffleInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
      await erc721Instance.grantRole(MINTER_ROLE, raffleInstance.address);

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, raffleInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, raffleInstance.address);
      }
      await raffleInstance.startRound(
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
        0, // maxTicket count
      );

      // BUY TICKET @EXCHANGE
      const networkE = await ethers.provider.getNetwork();
      const generateManyToManySignature = wrapManyToManySignature(networkE, exchangeInstance, owner);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce: utils.formatBytes32String("nonce"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: constants.AddressZero,
          extra,
        },
        items: [
          {
            tokenType: 0,
            token: raffleInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount,
          },
        ],
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: utils.formatBytes32String("nonce"),
          externalId: 0,
          expiresAt,
          referrer: constants.AddressZero,
          extra,
        },
        [
          {
            tokenType: 0,
            token: raffleInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx0)
        .to.emit(exchangeInstance, "PurchaseRaffle")
        .withArgs(
          receiver.address,
          isEqualEventArgArrObj(
            {
              tokenType: 0,
              token: raffleInstance.address,
              tokenId: BigNumber.from(0),
              amount: BigNumber.from(0),
            },
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(1), // ticketId = 1
              amount: BigNumber.from(1),
            },
          ),
          isEqualEventArgObj({
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: BigNumber.from(0),
            amount: BigNumber.from(amount),
          }),
          BigNumber.from(1),
        );
      await expect(tx0).changeTokenBalances(erc20Instance, [receiver, raffleInstance], [-amount, amount]);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      const tx = await raffleInstance.endRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(raffleInstance, "RoundEnded").withArgs(1, current);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      if (network.name === "hardhat") {
        // RANDOM
        await randomRequest(raffleInstance as IERC721Random, vrfInstance);
      } else {
        const eventFilter = raffleInstance.filters.RoundFinalized();
        const events = await raffleInstance.queryFilter(eventFilter);
        expect(events.length).to.be.greaterThan(0);
        expect(events[0].args?.round).to.equal(1);
      }

      // WAIT for RELEASE
      const latest = await time.latestBlock();
      await time.advanceBlockTo(latest.add(web3.utils.toBN(lotteryConfig.timeLagBeforeRelease + 1)));

      const tx1 = raffleInstance.releaseFunds(1);
      await expect(tx1).to.emit(raffleInstance, "Released").withArgs(1, amount);
      await expect(tx1).changeTokenBalances(erc20Instance, [owner, raffleInstance], [amount, -amount]);
    });

    it("should fail: is not releasable yet", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { raffleInstance, erc20Instance, erc721Instance } = await factory();

      const exchangeFactory = await ethers.getContractFactory("Exchange");
      const exchangeInstance = await exchangeFactory.deploy(tokenName, [owner.address], [100]);

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

      await raffleInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
      await erc721Instance.grantRole(MINTER_ROLE, raffleInstance.address);

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, raffleInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, raffleInstance.address);
      }
      await raffleInstance.startRound(
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
        0, // maxTicket count
      );

      // BUY TICKET @EXCHANGE
      const networkE = await ethers.provider.getNetwork();
      const generateManyToManySignature = wrapManyToManySignature(networkE, exchangeInstance, owner);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce: utils.formatBytes32String("nonce"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: constants.AddressZero,
          extra,
        },
        items: [
          {
            tokenType: 0,
            token: raffleInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount,
          },
        ],
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: utils.formatBytes32String("nonce"),
          externalId: 0,
          expiresAt,
          referrer: constants.AddressZero,
          extra,
        },
        [
          {
            tokenType: 0,
            token: raffleInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx0)
        .to.emit(exchangeInstance, "PurchaseRaffle")
        .withArgs(
          receiver.address,
          isEqualEventArgArrObj(
            {
              tokenType: 0,
              token: raffleInstance.address,
              tokenId: BigNumber.from(0),
              amount: BigNumber.from(0),
            },
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(1), // ticketId = 1
              amount: BigNumber.from(1),
            },
          ),
          isEqualEventArgObj({
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: BigNumber.from(0),
            amount: BigNumber.from(amount),
          }),
          BigNumber.from(1),
        );
      await expect(tx0).changeTokenBalances(erc20Instance, [receiver, raffleInstance], [-amount, amount]);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      const tx = await raffleInstance.endRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(raffleInstance, "RoundEnded").withArgs(1, current);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      if (network.name === "hardhat") {
        // RANDOM
        await randomRequest(raffleInstance as IERC721Random, vrfInstance);
      } else {
        const eventFilter = raffleInstance.filters.RoundFinalized();
        const events = await raffleInstance.queryFilter(eventFilter);
        expect(events.length).to.be.greaterThan(0);
        expect(events[0].args?.round).to.equal(1);
      }

      // NO WAIT for RELEASE
      const tx1 = raffleInstance.releaseFunds(1);
      await expect(tx1).to.be.revertedWithCustomError(raffleInstance, "NotComplete");
    });

    it("should fail: zero balance", async function () {
      const { raffleInstance } = await factory();

      // WAIT for RELEASE
      const latest = await time.latestBlock();
      await time.advanceBlockTo(latest.add(web3.utils.toBN(lotteryConfig.timeLagBeforeRelease + 1)));

      const tx1 = raffleInstance.releaseFunds(0);
      await expect(tx1).to.be.revertedWithCustomError(raffleInstance, "ZeroBalance");
    });

    it("should fail: no more tickets available", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { raffleInstance, erc20Instance, erc721Instance } = await factory();

      const exchangeFactory = await ethers.getContractFactory("Exchange");
      const exchangeInstance = await exchangeFactory.deploy(tokenName, [owner.address], [100]);

      await erc20Instance.mint(receiver.address, amount * 3);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount * 3);

      await raffleInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
      await erc721Instance.grantRole(MINTER_ROLE, raffleInstance.address);

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, raffleInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, raffleInstance.address);
      }
      await raffleInstance.startRound(
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
        2, // maxTicket count
      );

      // BUY TICKET @EXCHANGE
      const networkE = await ethers.provider.getNetwork();
      const generateManyToManySignature = wrapManyToManySignature(networkE, exchangeInstance, owner);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce: utils.formatBytes32String("nonce"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: constants.AddressZero,
          extra,
        },
        items: [
          {
            tokenType: 0,
            token: raffleInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount,
          },
        ],
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: utils.formatBytes32String("nonce"),
          externalId: 0,
          expiresAt,
          referrer: constants.AddressZero,
          extra,
        },
        [
          {
            tokenType: 0,
            token: raffleInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx0)
        .to.emit(exchangeInstance, "PurchaseRaffle")
        .withArgs(
          receiver.address,
          isEqualEventArgArrObj(
            {
              tokenType: 0,
              token: raffleInstance.address,
              tokenId: BigNumber.from(0),
              amount: BigNumber.from(0),
            },
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(1), // ticketId = 1
              amount: BigNumber.from(1),
            },
          ),
          isEqualEventArgObj({
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: BigNumber.from(0),
            amount: BigNumber.from(amount),
          }),
          BigNumber.from(1),
        );
      await expect(tx0).changeTokenBalances(erc20Instance, [receiver, raffleInstance], [-amount, amount]);

      const signature1 = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce: utils.formatBytes32String("nonce1"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: constants.AddressZero,
          extra,
        },
        items: [
          {
            tokenType: 0,
            token: raffleInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount,
          },
        ],
      });
      const tx1 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: utils.formatBytes32String("nonce1"),
          externalId: 0,
          expiresAt,
          referrer: constants.AddressZero,
          extra,
        },
        [
          {
            tokenType: 0,
            token: raffleInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature1,
      );
      await expect(tx1)
        .to.emit(exchangeInstance, "PurchaseRaffle")
        .withArgs(
          receiver.address,
          isEqualEventArgArrObj(
            {
              tokenType: 0,
              token: raffleInstance.address,
              tokenId: BigNumber.from(0),
              amount: BigNumber.from(0),
            },
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId: BigNumber.from(2), // ticketId = 2
              amount: BigNumber.from(1),
            },
          ),
          isEqualEventArgObj({
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: BigNumber.from(0),
            amount: BigNumber.from(amount),
          }),
          BigNumber.from(1),
        );
      await expect(tx1).changeTokenBalances(erc20Instance, [receiver, raffleInstance], [-amount, amount]);

      const signature2 = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce: utils.formatBytes32String("nonce2"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: constants.AddressZero,
          extra,
        },
        items: [
          {
            tokenType: 0,
            token: raffleInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount,
          },
        ],
      });
      const tx2 = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: utils.formatBytes32String("nonce2"),
          externalId: 0,
          expiresAt,
          referrer: constants.AddressZero,
          extra,
        },
        [
          {
            tokenType: 0,
            token: raffleInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature2,
      );
      await expect(tx2).to.be.revertedWithCustomError(raffleInstance, "LimitExceed");
    });

    it("should fail: current round is finished", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { raffleInstance, erc20Instance, erc721Instance } = await factory();

      const exchangeFactory = await ethers.getContractFactory("Exchange");
      const exchangeInstance = await exchangeFactory.deploy(tokenName, [owner.address], [100]);

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

      await raffleInstance.grantRole(MINTER_ROLE, exchangeInstance.address);
      await erc721Instance.grantRole(MINTER_ROLE, raffleInstance.address);

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, raffleInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, raffleInstance.address);
      }
      await raffleInstance.startRound(
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
        0, // maxTicket count
      );

      const tx0 = await raffleInstance.endRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx0).to.emit(raffleInstance, "RoundEnded").withArgs(1, current);

      // BUY TICKET @EXCHANGE
      const networkE = await ethers.provider.getNetwork();
      const generateManyToManySignature = wrapManyToManySignature(networkE, exchangeInstance, owner);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce: utils.formatBytes32String("nonce"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: constants.AddressZero,
          extra,
        },
        items: [
          {
            tokenType: 0,
            token: raffleInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId: 0,
            amount,
          },
        ],
      });

      const tx = exchangeInstance.connect(receiver).purchaseRaffle(
        {
          nonce: utils.formatBytes32String("nonce"),
          externalId: 0,
          expiresAt,
          referrer: constants.AddressZero,
          extra,
        },
        [
          {
            tokenType: 0,
            token: raffleInstance.address,
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx).to.be.revertedWithCustomError(raffleInstance, "WrongRound");
    });
  });

  describe("get prize", function () {
    it("should get prize", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { raffleInstance, erc721Instance, erc20Instance } = await factory();

      await erc721Instance.mintTicket(receiver.address, 1);

      await erc20Instance.mint(raffleInstance.address, utils.parseEther("20000"));
      // function setDummyRound(uint256 prizeNumber, uint256 requestId, Asset memory item, Asset memory price)
      await raffleInstance.setDummyRound(
        1, // winner ticketId
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
        0, // maxTicket count
      );

      await erc721Instance.connect(receiver).approve(raffleInstance.address, 1);

      const tx = raffleInstance.connect(receiver).getPrize(1);
      await expect(tx).to.emit(raffleInstance, "Prize").withArgs(receiver.address, 1, 0);
    });
  });
});

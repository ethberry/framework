import { expect } from "chai";
import { ethers, network, web3 } from "hardhat";
import { encodeBytes32String, getUint, parseEther, toBeHex, toQuantity, WeiPerEther, ZeroAddress } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { shouldBehaveLikeAccessControl, shouldBehaveLikePausable } from "@gemunion/contracts-mocha";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, nonce, PAUSER_ROLE, tokenName } from "@gemunion/contracts-constants";

import { expiresAt, extra, params, tokenId } from "../../constants";
import { deployLinkVrfFixture } from "../../shared/link";
import { VRFCoordinatorMock } from "../../../typechain-types";
import { randomRequest } from "../../shared/randomRequest";
import { deployLottery } from "./fixture";
import { wrapManyToManySignature } from "../../Exchange/shared/utils";
import {
  getBytesNumbersArr,
  getNumbersBytes,
  isEqualEventArgArrObj,
  isEqualEventArgObj,
  recursivelyDecodeResult,
} from "../../utils";
import { decodeMetadata } from "../../shared/metadata";

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

  shouldBehaveLikeAccessControl(async () => {
    const { lotteryInstance } = await factory();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return lotteryInstance;
  })(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  shouldBehaveLikePausable(async () => {
    const { lotteryInstance } = await factory();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return lotteryInstance;
  });

  describe("Start Round", function () {
    it("should start new round", async function () {
      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();
      const tx = await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        0, // maxTicket count
      );

      const current: number = (await time.latest()).toNumber();
      // emit RoundStarted(roundNumber, block.timestamp, maxTicket, ticket, price);
      await expect(tx)
        .to.emit(lotteryInstance, "RoundStarted")
        .withArgs(
          1n,
          toQuantity(current),
          0n,
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount,
          }),
          isEqualEventArgObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 0n,
            amount,
          }),
        );
    });

    it("should fail: not yet finished", async function () {
      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();
      await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        0, // maxTicket count
      );
      const tx = lotteryInstance.startRound(
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        0, // maxTicket count
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
          token: await erc721Instance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
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
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.getAddress());
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(1, await lotteryInstance.getAddress());
      }

      const tx = await lotteryInstance.endRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(lotteryInstance, "RoundEnded").withArgs(1, current);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      if (network.name === "hardhat") {
        await randomRequest(lotteryInstance, vrfInstance);
      }
    });

    it("should get current round info ", async function () {
      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();

      const tx0 = await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        0, // maxTicket count
      );
      const timeStart: number = (await time.latest()).toNumber();

      await expect(tx0)
        .to.emit(lotteryInstance, "RoundStarted")
        .withArgs(
          1n,
          toQuantity(timeStart),
          0n,
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId,
            amount,
          }),
          isEqualEventArgObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 0n,
            amount,
          }),
        );

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }
      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.getAddress());
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(1, await lotteryInstance.getAddress());
      }

      const tx = await lotteryInstance.endRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(lotteryInstance, "RoundEnded").withArgs(1, current);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      if (network.name === "hardhat") {
        await randomRequest(lotteryInstance, vrfInstance);
      }
      // emit RoundFinalized(currentRound.roundId, currentRound.values);
      const eventFilter = lotteryInstance.filters.RoundFinalized();
      const events = await lotteryInstance.queryFilter(eventFilter);
      const { winValues } = recursivelyDecodeResult(events[0].args);
      const roundInfo = await lotteryInstance.getCurrentRoundInfo();

      expect(recursivelyDecodeResult(roundInfo)).deep.include({
        roundId: 1n,
        startTimestamp: getUint(timeStart),
        endTimestamp: getUint(current),
        maxTicket: 0n,
        values: winValues,
        aggregation: [0n, 0n, 0n, 0n, 0n, 0n, 0n],
        acceptedAsset: {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 0n,
          amount,
        },
        ticketAsset: {
          tokenType: 2n,
          token: await erc721Instance.getAddress(),
          tokenId: 1n,
          amount,
        },
      });
    });

    it("should fail: previous round is already finished", async function () {
      const { lotteryInstance } = await factory();
      const tx = lotteryInstance.endRound();
      await expect(tx).to.be.revertedWithCustomError(lotteryInstance, "NotActive");
    });
  });

  describe("Purchase Lottery", function () {
    it("should purchase Lottery and mint ticket", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();

      const exchangeFactory = await ethers.getContractFactory("Exchange");
      const exchangeInstance = await exchangeFactory.deploy(tokenName, [owner.address], [100]);

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

      await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.getAddress());
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(1, await lotteryInstance.getAddress());
      }
      await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        0, // maxTicket count
      );

      // BUY TICKET @EXCHANGE
      const networkE = await ethers.provider.getNetwork();
      const generateManyToManySignature = wrapManyToManySignature(networkE, exchangeInstance, owner);

      const values = [1, 2, 3, 4, 5, 6];
      const ticketNumbers = getNumbersBytes(values);
      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce: encodeBytes32String("nonce"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: ZeroAddress,
          extra: ticketNumbers,
        },
        items: [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId: 0,
            amount,
          },
        ],
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce"),
          externalId: 0,
          expiresAt,
          referrer: ZeroAddress,
          extra: ticketNumbers,
        },
        [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx0)
        .to.emit(exchangeInstance, "PurchaseLottery")
        .withArgs(
          receiver.address,
          isEqualEventArgArrObj(
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0n,
              amount: 0n,
            },
            {
              tokenType: 2n,
              token: await erc721Instance.getAddress(),
              tokenId: 1n, // ticketId = 1
              amount: 1n,
            },
          ),
          isEqualEventArgObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 0n,
            amount: amount * 1n,
          }),
          1n,
          ticketNumbers,
        )
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ZeroAddress, receiver.address, tokenId);
      await expect(tx0).changeTokenBalances(erc20Instance, [receiver, lotteryInstance], [-amount, amount]);

      // TEST METADATA
      const metadata = recursivelyDecodeResult(await erc721Instance.getTokenMetadata(tokenId));
      const decodedMeta = decodeMetadata(metadata as any[]);
      expect(decodedMeta.ROUND).to.equal(1n);
      expect(toBeHex(decodedMeta.NUMBERS, 32)).to.equal(ticketNumbers);
      expect(getBytesNumbersArr(decodedMeta.NUMBERS)).to.have.all.members(values);
    });

    it("should finish round with 1 ticket and release funds", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();

      const exchangeFactory = await ethers.getContractFactory("Exchange");
      const exchangeInstance = await exchangeFactory.deploy(tokenName, [owner.address], [100]);

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

      await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.getAddress());
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(1, await lotteryInstance.getAddress());
      }
      await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
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
          nonce: encodeBytes32String("nonce"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        items: [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId: 0,
            amount,
          },
        ],
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce"),
          externalId: 0,
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx0)
        .to.emit(exchangeInstance, "PurchaseLottery")
        .withArgs(
          receiver.address,
          isEqualEventArgArrObj(
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0n,
              amount: 0n,
            },
            {
              tokenType: 2n,
              token: await erc721Instance.getAddress(),
              tokenId: 1n, // ticketId = 1
              amount: 1n,
            },
          ),
          isEqualEventArgObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 0n,
            amount: amount * 1n,
          }),
          1n,
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
        await randomRequest(lotteryInstance, vrfInstance);
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
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

      await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.getAddress());
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(1, await lotteryInstance.getAddress());
      }
      await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
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
          nonce: encodeBytes32String("nonce"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        items: [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId: 0,
            amount,
          },
        ],
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce"),
          externalId: 0,
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx0)
        .to.emit(exchangeInstance, "PurchaseLottery")
        .withArgs(
          receiver.address,
          isEqualEventArgArrObj(
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0n,
              amount: 0n,
            },
            {
              tokenType: 2n,
              token: await erc721Instance.getAddress(),
              tokenId: 1n, // ticketId = 1
              amount: 1n,
            },
          ),
          isEqualEventArgObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 0n,
            amount: amount * 1n,
          }),
          1n,
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
        await randomRequest(lotteryInstance, vrfInstance);
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

      await erc20Instance.mint(receiver.address, amount * 3n);
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount * 3n);

      await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.getAddress());
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(1, await lotteryInstance.getAddress());
      }
      await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
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
          nonce: encodeBytes32String("nonce"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        items: [
          {
            tokenType: 0n,
            token: await lotteryInstance.getAddress(),
            tokenId: 0n,
            amount: 0n,
          },
          {
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId: 0n,
            amount: 1n,
          },
        ],
        price: [
          {
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 0n,
            amount: amount * 1n,
          },
        ],
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce"),
          externalId: 0,
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx0)
        .to.emit(exchangeInstance, "PurchaseLottery")
        .withArgs(
          receiver.address,
          isEqualEventArgArrObj(
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0n,
              amount: 0n,
            },
            {
              tokenType: 2n,
              token: await erc721Instance.getAddress(),
              tokenId: 1n, // ticketId = 1
              amount: 1n,
            },
          ),
          isEqualEventArgObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 0n,
            amount: amount * 1n,
          }),
          1n,
          params.extra,
        );
      await expect(tx0).changeTokenBalances(erc20Instance, [receiver, lotteryInstance], [-amount, amount]);

      const signature1 = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce: encodeBytes32String("nonce1"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        items: [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId: 0,
            amount,
          },
        ],
      });
      const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce1"),
          externalId: 0,
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        signature1,
      );
      await expect(tx1)
        .to.emit(exchangeInstance, "PurchaseLottery")
        .withArgs(
          receiver.address,
          isEqualEventArgArrObj(
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0n,
              amount: 0n,
            },
            {
              tokenType: 2n,
              token: await erc721Instance.getAddress(),
              tokenId: 2n, // ticketId = 2
              amount: 1n,
            },
          ),
          isEqualEventArgObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 0n,
            amount: amount * 1n,
          }),
          1n,
          params.extra,
        );
      await expect(tx1).changeTokenBalances(erc20Instance, [receiver, lotteryInstance], [-amount, amount]);

      const signature2 = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce: encodeBytes32String("nonce2"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        items: [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId: 0,
            amount,
          },
        ],
      });
      const tx2 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce2"),
          externalId: 0,
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
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
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

      await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.getAddress());
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(1, await lotteryInstance.getAddress());
      }
      await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        0, // maxTicket count
      );

      const tx0 = await lotteryInstance.endRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx0).to.emit(lotteryInstance, "RoundEnded").withArgs(1, current);

      // BUY TICKET @EXCHANGE
      const networkE = await ethers.provider.getNetwork();
      const generateManyToManySignature = wrapManyToManySignature(networkE, exchangeInstance, owner);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce: encodeBytes32String("nonce"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        items: [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId: 0,
            amount,
          },
        ],
      });

      const tx = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce"),
          externalId: 0,
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
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

      const values = [8, 5, 3, 2, 1, 0];
      const aggregation = [0, 0, 0, 0, 0, 0, 1];

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();

      const defNumbers = getNumbersBytes(values);
      await erc721Instance.mintTicket(receiver.address, 1, defNumbers);

      await erc20Instance.mint(lotteryInstance.getAddress(), parseEther("20000"));

      await lotteryInstance.setDummyRound(
        defNumbers,
        values,
        aggregation,
        nonce,
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        0, // maxTicket count
      );

      await erc721Instance.connect(receiver).approve(lotteryInstance.getAddress(), 1);

      const prizeAmount = WeiPerEther * 7000n - 180n; // rounding error

      const tx = lotteryInstance.connect(receiver).getPrize(1);
      await expect(tx).to.emit(lotteryInstance, "Prize").withArgs(receiver.address, 1, prizeAmount);
    });

    it("should get prize: Jackpot 2 tickets", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const values = [8, 5, 3, 2, 1, 0];
      const aggregation = [0, 0, 0, 0, 0, 0, 2];

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();
      await erc20Instance.mint(lotteryInstance.getAddress(), parseEther("20000"));

      const defNumbers = getNumbersBytes(values);
      await erc721Instance.mintTicket(receiver.address, 1, defNumbers);
      await erc721Instance.connect(receiver).approve(lotteryInstance.getAddress(), 1);

      await lotteryInstance.setDummyRound(
        defNumbers,
        values,
        aggregation,
        nonce,
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 1,
          amount,
        },
        0, // maxTicket count
      );

      const prizeAmount = WeiPerEther * 3500n - 200n; // rounding error

      const tx = lotteryInstance.connect(receiver).getPrize(1);
      await expect(tx).to.emit(lotteryInstance, "Prize").withArgs(receiver.address, 1, prizeAmount);
    });

    it("should fail: round not finished", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();

      const exchangeFactory = await ethers.getContractFactory("Exchange");
      const exchangeInstance = await exchangeFactory.deploy(tokenName, [owner.address], [100]);

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount);

      await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.getAddress());
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(1, await lotteryInstance.getAddress());
      }
      await lotteryInstance.startRound(
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 1,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        0, // maxTicket count
      );

      // const tx0 = await lotteryInstance.endRound();
      // const current: number = (await time.latest()).toNumber();
      // await expect(tx0).to.emit(lotteryInstance, "RoundEnded").withArgs(1, current);

      // BUY TICKET @EXCHANGE
      const networkE = await ethers.provider.getNetwork();
      const generateManyToManySignature = wrapManyToManySignature(networkE, exchangeInstance, owner);

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params: {
          nonce: encodeBytes32String("nonce"),
          externalId: 0, // wtf?
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        items: [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        price: [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId: 0,
            amount,
          },
        ],
      });

      const tx = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce"),
          externalId: 0,
          expiresAt,
          referrer: ZeroAddress,
          extra,
        },
        [
          {
            tokenType: 0,
            token: await lotteryInstance.getAddress(),
            tokenId: 0,
            amount: 0,
          },
          {
            tokenType: 2,
            token: await erc721Instance.getAddress(),
            tokenId: 0,
            amount: 1,
          },
        ],
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx)
        .to.emit(exchangeInstance, "PurchaseLottery")
        .withArgs(
          receiver.address,
          isEqualEventArgArrObj(
            {
              tokenType: 0n,
              token: await lotteryInstance.getAddress(),
              tokenId: 0n,
              amount: 0n,
            },
            {
              tokenType: 2n,
              token: await erc721Instance.getAddress(),
              tokenId: 1n, // ticketId = 1
              amount: 1n,
            },
          ),
          isEqualEventArgObj({
            tokenType: 1n,
            token: await erc20Instance.getAddress(),
            tokenId: 0n,
            amount: amount * 1n,
          }),
          1n,
          params.extra,
        )
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ZeroAddress, receiver.address, tokenId);
      await expect(tx).changeTokenBalances(erc20Instance, [receiver, lotteryInstance], [-amount, amount]);

      const tx1 = lotteryInstance.connect(receiver).getPrize(1);
      // await expect(tx).to.emit(lotteryInstance, "Prize").withArgs(receiver.address, 1, prizeAmount);
      await expect(tx1).to.be.revertedWithCustomError(lotteryInstance, "NotComplete");
    });

    it("should fail: already got prize", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const values = [8, 5, 3, 2, 1, 0];
      const aggregation = [0, 0, 0, 0, 0, 0, 1];

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();

      const defNumbers = getNumbersBytes(values);
      await erc721Instance.mintTicket(receiver.address, 1, defNumbers);
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());
      await erc20Instance.mint(lotteryInstance.getAddress(), parseEther("20000"));

      await lotteryInstance.setDummyRound(
        defNumbers,
        values,
        aggregation,
        nonce,
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
        0, // maxTicket count
      );

      await erc721Instance.connect(receiver).approve(lotteryInstance.getAddress(), 1);

      const prizeAmount = WeiPerEther * 7000n - 180n; // rounding error

      const tx = lotteryInstance.connect(receiver).getPrize(1);
      await expect(tx).to.emit(lotteryInstance, "Prize").withArgs(receiver.address, 1, prizeAmount);

      const tx1 = lotteryInstance.connect(receiver).getPrize(1);
      await expect(tx1).to.be.revertedWithCustomError(lotteryInstance, "WrongToken");
    });
  });
});

import { expect } from "chai";
import { ethers, network, web3 } from "hardhat";
import { encodeBytes32String, getUint, parseEther, toBeHex, toQuantity, WeiPerEther, ZeroAddress } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { shouldBehaveLikeAccessControl, shouldBehaveLikePausable } from "@gemunion/contracts-mocha";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, nonce, PAUSER_ROLE } from "@gemunion/contracts-constants";

import { expiresAt, externalId, extra, params, tokenId } from "../../constants";
import { deployLinkVrfFixture } from "../../shared/link";
import { VRFCoordinatorMock } from "../../../typechain-types";
import { randomRequest } from "../../shared/randomRequest";
import { deployLottery } from "./fixture";
import { wrapOneToOneSignature } from "../../DiamondExchange/shared/utils";
import { getBytesNumbersArr, getNumbersBytes, isEqualEventArgObj, recursivelyDecodeResult } from "../../utils";
import { decodeMetadata } from "../../shared/metadata";
import { deployDiamond } from "../../DiamondExchange/shared/fixture";

const delay = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

describe("Lottery", function () {
  let vrfInstance: VRFCoordinatorMock;

  const lotteryConfig = {
    timeLagBeforeRelease: 100, // production: release after 2592000 seconds = 30 days
    commission: 30, // lottery wallet gets 30% commission from each round balance
  };

  const factoryDiamond = async () =>
    deployDiamond(
      "DiamondExchange",
      [
        "ExchangeLotteryFacet",
        "PausableFacet",
        "AccessControlFacet",
        "WalletFacet", //
      ],
      "DiamondExchangeInit",
      {
        // log: true,
        logSelectors: false, //
      },
    );

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
      const [_owner, receiver] = await ethers.getSigners();

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

      const values = [1, 2, 3, 4, 5, 6];
      const defNumbers = getNumbersBytes(values);
      await erc721Instance.mintTicket(receiver.address, 1, 101 /* db id */, defNumbers);

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

      const diamondInstance = await factoryDiamond();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeLotteryFacet", diamondAddress);

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
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, "Exchange", owner);

      const values = [1, 2, 3, 4, 5, 6];
      const ticketNumbers = getNumbersBytes(values);
      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          externalId,
          expiresAt,
          nonce: encodeBytes32String("nonce"),
          extra: ticketNumbers,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
      });
      // externalId,
      //   expiresAt,
      //   nonce: encodeBytes32String("nonce"),
      //   extra,
      //   receiver: await lotteryInstance.getAddress(),
      //   referrer: ZeroAddress,
      const tx0 = await exchangeInstance.connect(receiver).purchaseLottery(
        {
          externalId,
          expiresAt,
          nonce: encodeBytes32String("nonce"),
          extra: ticketNumbers,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        {
          tokenType: 2n,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
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
          externalId,
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId: 1n, // ticketId = 1
            amount: 1n,
          }),
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

      const diamondInstance = await factoryDiamond();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeLotteryFacet", diamondAddress);

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
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, "Exchange", owner);

      const dbRoundId = 101;
      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          externalId: dbRoundId, // externalId: db roundId
          expiresAt,
          nonce: encodeBytes32String("nonce"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce"),
          externalId: dbRoundId, // externalId: db roundId
          expiresAt,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
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
          dbRoundId, // externalId: db roundId
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId: 1n, // ticketId = 1
            amount: 1n,
          }),
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

      // const roundInfo = await lotteryInstance.getCurrentRoundInfo();

      // WAIT for RELEASE
      const latest = await time.latestBlock();
      await time.advanceBlockTo(latest.add(web3.utils.toBN(lotteryConfig.timeLagBeforeRelease + 1)));

      const tx1 = lotteryInstance.releaseFunds(1);
      await expect(tx1)
        .to.emit(lotteryInstance, "Released")
        .withArgs(1, amount - (amount / 100n) * BigInt(lotteryConfig.commission));
      await expect(tx1).changeTokenBalances(
        erc20Instance,
        [owner, lotteryInstance],
        [
          amount - (amount / 100n) * BigInt(lotteryConfig.commission),
          -(amount - (amount / 100n) * BigInt(lotteryConfig.commission)),
        ],
      );
    });

    it("should finish ETH round with 1 ticket and release funds", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc721Instance } = await factory();

      const diamondInstance = await factoryDiamond();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeLotteryFacet", diamondAddress);

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
          tokenType: 0,
          token: ZeroAddress,
          tokenId: 0,
          amount: WeiPerEther,
        },
        0, // maxTicket count
      );

      // BUY TICKET @EXCHANGE
      const networkE = await ethers.provider.getNetwork();
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, "Exchange", owner);

      const dbRoundId = 101;
      const values = [8, 5, 3, 2, 1, 0];
      const defNumbers = getNumbersBytes(values);
      console.info("defNumbers", defNumbers);
      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          externalId: dbRoundId, // externalId: db roundId
          expiresAt,
          nonce: encodeBytes32String("nonce"),
          extra: defNumbers,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 0,
          token: ZeroAddress,
          tokenId: 0,
          amount: WeiPerEther,
        },
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce"),
          externalId: dbRoundId, // externalId: db roundId
          expiresAt,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
          extra: defNumbers,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        {
          tokenType: 0,
          token: ZeroAddress,
          tokenId: 0,
          amount: WeiPerEther,
        },
        signature,
        { value: WeiPerEther },
      );

      await expect(tx0)
        .to.emit(exchangeInstance, "PurchaseLottery")
        .withArgs(
          receiver.address,
          dbRoundId, // externalId: db roundId
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId: 1n, // ticketId = 1
            amount: 1n,
          }),
          isEqualEventArgObj({
            tokenType: 0n,
            token: ZeroAddress,
            tokenId: 0n,
            amount: WeiPerEther,
          }),
          1n,
          defNumbers,
        );
      await expect(tx0).changeEtherBalances([lotteryInstance, receiver], [WeiPerEther, -WeiPerEther]);

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

      // const roundInfo = await lotteryInstance.getCurrentRoundInfo();
      // console.log("recursivelyDecodeResult(roundInfo)", recursivelyDecodeResult(roundInfo));

      // WAIT for RELEASE
      const latest = await time.latestBlock();
      await time.advanceBlockTo(latest.add(web3.utils.toBN(lotteryConfig.timeLagBeforeRelease + 1)));

      const tx1 = lotteryInstance.releaseFunds(1);
      const total = WeiPerEther - (WeiPerEther / 100n) * BigInt(lotteryConfig.commission);
      await expect(tx1).to.emit(lotteryInstance, "Released").withArgs(1, total);
      await expect(tx1).changeEtherBalances([lotteryInstance, owner], [-total, total]);
    });

    it("should get prize from previous round", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();

      const diamondInstance = await factoryDiamond();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeLotteryFacet", diamondAddress);

      await erc20Instance.mint(receiver.address, amount * 2n);
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount * 2n);

      await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.getAddress());
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(1, await lotteryInstance.getAddress());
      }

      // ROUND 1
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
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, "Exchange", owner);

      const dbRoundId = 101;
      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          externalId: dbRoundId, // externalId: db roundId
          expiresAt,
          nonce: encodeBytes32String("nonce"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce"),
          externalId: dbRoundId, // externalId: db roundId
          expiresAt,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
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
          dbRoundId, // externalId: db roundId
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId: 1n, // ticketId = 1
            amount: 1n,
          }),
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

      // ROUND 2
      const tx1 = await lotteryInstance.startRound(
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
      const current1: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(lotteryInstance, "RoundStarted")
        .withArgs(
          2n, // round 2
          toQuantity(current1),
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

      const tx2 = lotteryInstance.connect(receiver).getPrize(tokenId, 1);
      await expect(tx2).to.emit(lotteryInstance, "Prize");
      // TODO .withArgs(receiver.address, 1, 1, prizeAmount);

      // TEST METADATA
      const metadata = recursivelyDecodeResult(await erc721Instance.getTokenMetadata(tokenId));
      const decodedMeta = decodeMetadata(metadata as any[]);
      expect(decodedMeta.PRIZE).to.equal(1n);
      expect(decodedMeta.ROUND).to.equal(BigInt(dbRoundId));
      expect(toBeHex(decodedMeta.NUMBERS, 32)).to.equal(params.extra);
      // expect(getBytesNumbersArr(decodedMeta.NUMBERS)).to.have.all.members(values);
    });

    it("should fail get prize from previous round: expired", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();

      const diamondInstance = await factoryDiamond();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeLotteryFacet", diamondAddress);

      await erc20Instance.mint(receiver.address, amount * 2n);
      await erc20Instance.connect(receiver).approve(exchangeInstance.getAddress(), amount * 2n);

      await lotteryInstance.grantRole(MINTER_ROLE, exchangeInstance.getAddress());
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

      if (network.name === "hardhat") {
        // Add Consumer to VRFV2
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.getAddress());
        await expect(tx02)
          .to.emit(vrfInstance, "SubscriptionConsumerAdded")
          .withArgs(1, await lotteryInstance.getAddress());
      }

      // ROUND 1
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
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, "Exchange", owner);

      const dbRoundId = 101;
      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          externalId: dbRoundId, // externalId: db roundId
          expiresAt,
          nonce: encodeBytes32String("nonce"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce"),
          externalId: dbRoundId, // externalId: db roundId
          expiresAt,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
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
          dbRoundId, // externalId: db roundId
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId: 1n, // ticketId = 1
            amount: 1n,
          }),
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

      // ROUND 2
      const tx1 = await lotteryInstance.startRound(
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
      const current1: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(lotteryInstance, "RoundStarted")
        .withArgs(
          2n, // round 2
          toQuantity(current1),
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

      // WAIT for RELEASE
      const latest = await time.latestBlock();
      await time.advanceBlockTo(latest.add(web3.utils.toBN(lotteryConfig.timeLagBeforeRelease + 1)));

      const tx2 = lotteryInstance.connect(receiver).getPrize(tokenId, 1);
      await expect(tx2).to.be.revertedWithCustomError(lotteryInstance, "Expired");
    });

    it("should fail: is not releasable yet", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();

      const diamondInstance = await factoryDiamond();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeLotteryFacet", diamondAddress);

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
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, "Exchange", owner);

      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          externalId,
          expiresAt,
          nonce: encodeBytes32String("nonce2"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          externalId, // wtf?
          expiresAt,
          nonce: encodeBytes32String("nonce2"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
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
          externalId,
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId: 1n, // ticketId = 1
            amount: 1n,
          }),
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

      const diamondInstance = await factoryDiamond();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeLotteryFacet", diamondAddress);

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
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, "Exchange", owner);

      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          externalId,
          expiresAt,
          nonce: encodeBytes32String("nonce1"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        item: {
          tokenType: 2n,
          token: await erc721Instance.getAddress(),
          tokenId: 0n,
          amount: 1n,
        },
        price: {
          tokenType: 1n,
          token: await erc20Instance.getAddress(),
          tokenId: 0n,
          amount: amount * 1n,
        },
      });

      const tx0 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          externalId,
          expiresAt,
          nonce: encodeBytes32String("nonce1"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
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
          externalId,
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId: 1n, // ticketId = 1
            amount: 1n,
          }),
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

      const signature1 = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          externalId,
          expiresAt,
          nonce: encodeBytes32String("nonce2"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
      });
      const tx1 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce2"),
          externalId,
          expiresAt,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
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
          externalId,
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId: 2n, // ticketId = 2
            amount: 1n,
          }),
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

      const signature2 = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          externalId,
          expiresAt,
          nonce: encodeBytes32String("nonce3"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
      });
      const tx2 = exchangeInstance.connect(receiver).purchaseLottery(
        {
          nonce: encodeBytes32String("nonce3"),
          externalId,
          expiresAt,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
          extra,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
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

      const diamondInstance = await factoryDiamond();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeLotteryFacet", diamondAddress);

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
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, "Exchange", owner);

      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          externalId,
          expiresAt,
          nonce: encodeBytes32String("nonce2"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
      });

      const tx = exchangeInstance.connect(receiver).purchaseLottery(
        {
          externalId,
          expiresAt,
          nonce: encodeBytes32String("nonce2"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
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
      const ticketNumbers = getNumbersBytes(values);
      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();

      const defNumbers = getNumbersBytes(values);
      await erc721Instance.mintTicket(receiver.address, 1, 101 /* db id */, defNumbers);
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

      const tx = lotteryInstance.connect(receiver).getPrize(tokenId, 1);
      await expect(tx).to.emit(lotteryInstance, "Prize").withArgs(receiver.address, 1, 1, prizeAmount);

      // TEST METADATA
      const metadata = recursivelyDecodeResult(await erc721Instance.getTokenMetadata(tokenId));
      const decodedMeta = decodeMetadata(metadata as any[]);
      expect(decodedMeta.PRIZE).to.equal(1n);
      expect(decodedMeta.ROUND).to.equal(101n);
      expect(toBeHex(decodedMeta.NUMBERS, 32)).to.equal(ticketNumbers);
      expect(getBytesNumbersArr(decodedMeta.NUMBERS)).to.have.all.members(values);
    });

    it("should get prize: Jackpot 2 tickets", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const values = [8, 5, 3, 2, 1, 0];
      const aggregation = [0, 0, 0, 0, 0, 0, 2];

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();
      await erc20Instance.mint(lotteryInstance.getAddress(), parseEther("20000"));

      const defNumbers = getNumbersBytes(values);
      await erc721Instance.mintTicket(receiver.address, 1, 101 /* db id */, defNumbers);
      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.getAddress());

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

      const tx = lotteryInstance.connect(receiver).getPrize(tokenId, 1);
      await expect(tx).to.emit(lotteryInstance, "Prize").withArgs(receiver.address, 1, 1, prizeAmount);
    });

    it("should fail: round not finished", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc20Instance, erc721Instance } = await factory();

      const diamondInstance = await factoryDiamond();
      const diamondAddress = await diamondInstance.getAddress();

      const exchangeInstance = await ethers.getContractAt("ExchangeLotteryFacet", diamondAddress);

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
      const generateOneToOneSignature = wrapOneToOneSignature(networkE, exchangeInstance, "Exchange", owner);

      const signature = await generateOneToOneSignature({
        account: receiver.address,
        params: {
          externalId,
          expiresAt,
          nonce: encodeBytes32String("nonce2"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        item: {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
        price: {
          tokenType: 1,
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount,
        },
      });

      const tx = exchangeInstance.connect(receiver).purchaseLottery(
        {
          externalId, // wtf?
          expiresAt,
          nonce: encodeBytes32String("nonce2"),
          extra,
          receiver: await lotteryInstance.getAddress(),
          referrer: ZeroAddress,
        },
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId: 0,
          amount: 1,
        },
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
          externalId,
          isEqualEventArgObj({
            tokenType: 2n,
            token: await erc721Instance.getAddress(),
            tokenId: 1n, // ticketId = 1
            amount: 1n,
          }),
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

      const tx1 = lotteryInstance.connect(receiver).getPrize(tokenId, 1);
      await expect(tx1).to.be.revertedWithCustomError(lotteryInstance, "NotComplete");
    });

    it("should fail: already got prize", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const values = [8, 5, 3, 2, 1, 0];
      const aggregation = [0, 0, 0, 0, 0, 0, 1];

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();

      const defNumbers = getNumbersBytes(values);
      await erc721Instance.mintTicket(receiver.address, 1, 1, defNumbers);
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

      const tx = lotteryInstance.connect(receiver).getPrize(tokenId, 1);
      await expect(tx).to.emit(lotteryInstance, "Prize").withArgs(receiver.address, 1, 1, prizeAmount);

      const tx1 = lotteryInstance.connect(receiver).getPrize(tokenId, 1);
      await expect(tx1).to.be.revertedWithCustomError(lotteryInstance, "WrongToken");
    });

    it("should fail: not an owner", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();

      const values = [8, 5, 3, 2, 1, 0];
      const aggregation = [0, 0, 0, 0, 0, 0, 1];

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();

      const defNumbers = getNumbersBytes(values);
      await erc721Instance.mintTicket(receiver.address, 1, 1, defNumbers);
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

      const tx = lotteryInstance.connect(stranger).getPrize(tokenId, 1);
      await expect(tx).to.be.revertedWithCustomError(lotteryInstance, "NotAnOwner");
    });

    it("should fail: wrong round", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const values = [8, 5, 3, 2, 1, 0];
      const aggregation = [0, 0, 0, 0, 0, 0, 1];

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();

      const defNumbers = getNumbersBytes(values);
      await erc721Instance.mintTicket(receiver.address, 1, 101 /* db id */, defNumbers);
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

      const tx = lotteryInstance.connect(receiver).getPrize(1, 2);
      await expect(tx).to.be.revertedWithCustomError(lotteryInstance, "WrongRound");
    });

    it("should fail: wrong token round", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const values = [8, 5, 3, 2, 1, 0];
      const aggregation = [0, 0, 0, 0, 0, 0, 1];

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();

      const defNumbers = getNumbersBytes(values);
      await erc721Instance.mintTicket(receiver.address, 1, 101 /* db id */, defNumbers);
      await erc721Instance.mintTicket(receiver.address, 2, 101 /* db id */, defNumbers);
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

      const tx = lotteryInstance.connect(receiver).getPrize(1, 2);
      await expect(tx).to.be.revertedWithCustomError(lotteryInstance, "WrongRound");
    });
  });
});

import { expect } from "chai";
import { ethers, network, web3 } from "hardhat";
import { constants, utils, BigNumber } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, nonce, PAUSER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldBehaveLikePausable } from "@gemunion/contracts-mocha";

import { expiresAt, externalId, extra, params } from "../../constants";
import { deployLinkVrfFixture } from "../../shared/link";
import { IERC721Random, VRFCoordinatorMock } from "../../../typechain-types";
import { randomRequest } from "../../shared/randomRequest";
import { deployLotteryRaffle } from "./fixture";

const delay = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

describe.only("Lottery Raffle", function () {
  let vrfInstance: VRFCoordinatorMock;

  const lotteryConfig = {
    timeLagBeforeRelease: 2592, // production: release after 2592000 seconds = 30 days
    maxTickets: 2, // production: 5000 (dev: 2)
    commission: 30, // lottery wallet gets 30% commission from each round balance
  };

  const factory = () => deployLotteryRaffle(lotteryConfig);

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
    return lotteryInstance;
  })(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  shouldBehaveLikePausable(async () => {
    const { lotteryInstance } = await factory();
    return lotteryInstance;
  });

  describe("startRound", function () {
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

    it("should fail: paused", async function () {
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

  describe("finishRound", function () {
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
      await expect(tx).to.be.revertedWithCustomError(lotteryInstance, "Expired");
    });
  });

  describe("finalizeRound", function () {
    it("should finalize round with 1 ticket", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount);

      await erc20Instance.mint(stranger.address, amount);
      await erc20Instance.connect(stranger).approve(lotteryInstance.address, amount);

      await erc20Instance.mint(lotteryInstance.address, utils.parseEther("20000"));

      await erc721Instance.grantRole(DEFAULT_ADMIN_ROLE, lotteryInstance.address);
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
      const signature = await generateSignature({
        account: receiver.address,
        params,
        price: {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      });

      const tx0 = lotteryInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature,
      );

      await expect(tx0).to.emit(lotteryInstance, "PurchaseRaffle").withArgs(1, receiver.address, amount, 1);

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
    });
  });

  describe("PurchaseRaffle", function () {
    it("should purchase ticket", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount);

      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

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
      const signature = await generateSignature({
        account: receiver.address,
        params,
        price: {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      });

      const tx = lotteryInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature,
      );

      await expect(tx).to.emit(lotteryInstance, "PurchaseRaffle").withArgs(1, receiver.address, amount, 1);
    });

    it("should release", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance, lotteryWalletInstance } =
        await factory();

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount);
      await erc20Instance.mint(lotteryInstance.address, utils.parseEther("20000"));

      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      if (network.name === "hardhat") {
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

      const signature = await generateSignature({
        account: receiver.address,
        params,
        price: {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      });

      const tx = lotteryInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx).to.emit(lotteryInstance, "PurchaseRaffle").withArgs(1, receiver.address, amount, 1);

      await lotteryInstance.endRound();
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(2592)));

      const tx1 = lotteryInstance.releaseFunds(1);
      await expect(tx1).to.emit(lotteryInstance, "Released").withArgs(1, amount);

      await expect(tx1)
        .to.emit(lotteryWalletInstance, "TransferReceived")
        .withArgs(lotteryInstance.address, lotteryInstance.address, amount, "0x");
    });

    it("should fail: is not releasable yet", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount);

      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      if (network.name === "hardhat") {
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

      const signature = await generateSignature({
        account: receiver.address,
        params,
        price: {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      });

      const tx = lotteryInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx).to.emit(lotteryInstance, "PurchaseRaffle").withArgs(1, receiver.address, amount, 1);
      await lotteryInstance.endRound();

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(1)));

      const tx1 = lotteryInstance.releaseFunds(1);
      await expect(tx1).to.be.revertedWithCustomError(lotteryInstance, "NotComplete");
    });

    it("should fail: wrong signer", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

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

      const signature = await generateSignature({
        account: receiver.address,
        params,
        price: {
          tokenType: 1,
          token: constants.AddressZero,
          tokenId: 0,
          amount,
        },
      });

      const tx = lotteryInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 2,
          token: constants.AddressZero,
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx).to.be.revertedWithCustomError(lotteryInstance, "SignerMissingRole");
    });

    it("should fail: wrong signature", async function () {
      const [_owner, receiver] = await ethers.getSigners();

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

      const signature = utils.formatBytes32String("signature");

      const tx = lotteryInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 0,
          token: constants.AddressZero,
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx).to.be.revertedWith("ECDSA: invalid signature length");
    });

    it("should fail: expired signature", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount);

      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

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

      const signature = await generateSignature({
        account: receiver.address,
        params,
        price: {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      });

      const tx1 = lotteryInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx1).to.emit(lotteryInstance, "PurchaseRaffle").withArgs(1, receiver.address, amount, 1);

      const tx2 = lotteryInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx2).to.be.revertedWithCustomError(lotteryInstance, "ExpiredSignature");
    });

    it("should fail: insufficient allowance", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

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

      const signature = await generateSignature({
        account: receiver.address,
        params,
        price: {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: amount * 2,
        },
      });

      const tx = lotteryInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: amount * 2,
        },
        signature,
      );
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should fail: transfer amount exceeds balance", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

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

      const signature = await generateSignature({
        account: receiver.address,
        params,
        price: {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: amount * 2,
        },
      });

      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount * 2);

      const tx = lotteryInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount: amount * 2,
        },
        signature,
      );

      await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should fail: no more tickets available", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount);

      await erc20Instance.mint(stranger.address, amount);
      await erc20Instance.connect(stranger).approve(lotteryInstance.address, amount);

      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      if (network.name === "hardhat") {
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

      const params1 = {
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: constants.AddressZero,
        extra,
      };
      const signature1 = await generateSignature({
        account: receiver.address,
        params: params1,
        price: {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      });

      const tx1 = lotteryInstance.connect(receiver).purchase(
        params1,
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature1,
      );
      await expect(tx1).to.emit(lotteryInstance, "PurchaseRaffle").withArgs(1, receiver.address, amount, 1);

      const params2 = {
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: constants.AddressZero,
        extra,
      };
      const signature2 = await generateSignature({
        account: stranger.address,
        params: params2,
        price: {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      });

      const tx2 = lotteryInstance.connect(stranger).purchase(
        params2,
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature2,
      );
      await expect(tx2).to.emit(lotteryInstance, "PurchaseRaffle").withArgs(2, stranger.address, amount, 1);

      const params3 = {
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: constants.AddressZero,
        extra,
      };
      const signature3 = await generateSignature({
        account: stranger.address,
        params: params3,
        price: {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      });

      const tx3 = lotteryInstance.connect(stranger).purchase(
        params3,
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature3,
      );
      await expect(tx3).to.be.revertedWithCustomError(lotteryInstance, "LimitExceed");
    });

    it("should fail: current round is finished", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount);

      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      if (network.name === "hardhat") {
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

      const signature = await generateSignature({
        account: receiver.address,
        params,
        price: {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
      });

      const tx = lotteryInstance.connect(receiver).purchase(
        params,
        {
          tokenType: 1,
          token: erc20Instance.address,
          tokenId: 0,
          amount,
        },
        signature,
      );
      await expect(tx).to.be.revertedWithCustomError(lotteryInstance, "NotActive");
    });
  });

  describe("get prize", function () {
    it("should get prize", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();

      await erc721Instance.mintTicket(receiver.address, 1);
      await erc721Instance.connect(receiver).approve(lotteryInstance.address, 1);
      await erc20Instance.mint(lotteryInstance.address, utils.parseEther("20000"));

      await lotteryInstance.setDummyRound(
        1, // prizeNumber
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

      const tx = lotteryInstance.connect(receiver).getPrize(1);
      await expect(tx).to.emit(lotteryInstance, "Prize").withArgs(receiver.address, 1, 0);
    });
  });

  describe("get data", function () {
    it("should get dummy round data", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();

      await erc721Instance.mintTicket(receiver.address, 1);
      await erc721Instance.connect(receiver).approve(lotteryInstance.address, 1);

      // TIME
      const current: number = (await time.latest()).toNumber();

      await lotteryInstance.setDummyRound(
        1, // prizeNumber
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

      // ROUND COUNT
      const roundCount = await lotteryInstance.getRoundsCount();
      expect(roundCount).to.equal(1 + 1); // + root round

      // FULL ROUND DATA
      const roundData = await lotteryInstance.getRound(1);

      expect(roundData).to.have.deep.nested.property("roundId", BigNumber.from(1));
      expect(roundData).to.have.deep.nested.property("startTimestamp", BigNumber.from(current + 1));
      expect(roundData).to.have.deep.nested.property("endTimestamp", BigNumber.from(current + 2));
      expect(roundData).to.have.deep.nested.property("balance", utils.parseEther("10000"));
      expect(roundData).to.have.deep.nested.property("total", utils.parseEther("7000"));
      expect(roundData)
        .to.have.deep.nested.property("ticketCounter")
        .to.have.deep.nested.property("_value", BigNumber.from(1));
      expect(roundData).to.have.deep.nested.property("prizeNumber", BigNumber.from(1));
      expect(roundData).to.have.deep.nested.property("requestId", BigNumber.from(nonce));
      expect(roundData)
        .to.have.deep.nested.property("ticketAsset")
        .to.have.deep.nested.members([2, erc721Instance.address, BigNumber.from(0), BigNumber.from(amount)]);
      expect(roundData)
        .to.have.deep.nested.property("acceptedAsset")
        .to.have.deep.nested.members([1, erc20Instance.address, BigNumber.from(0), BigNumber.from(amount)]);

      // CURRENT ROUND DATA (SHORT)
      const currentRound = await lotteryInstance.getCurrentRoundInfo();

      expect(currentRound).to.have.deep.nested.property("roundId", BigNumber.from(1));
      expect(currentRound).to.have.deep.nested.property("startTimestamp", BigNumber.from(current + 1));
      expect(currentRound).to.have.deep.nested.property("endTimestamp", BigNumber.from(current + 2));
      expect(currentRound)
        .to.have.deep.nested.property("ticketAsset")
        .to.have.deep.nested.members([2, erc721Instance.address, BigNumber.from(0), BigNumber.from(amount)]);
      expect(currentRound)
        .to.have.deep.nested.property("acceptedAsset")
        .to.have.deep.nested.members([1, erc20Instance.address, BigNumber.from(0), BigNumber.from(amount)]);
    });

    it("should fail: round not exist", async function () {
      const [_owner] = await ethers.getSigners();

      const { lotteryInstance } = await factory();

      // ROUND COUNT
      const roundCount = await lotteryInstance.getRoundsCount();
      expect(roundCount).to.equal(1); // root round

      // FULL ROUND DATA
      const tx = lotteryInstance.getRound(2);
      await expect(tx).to.be.revertedWithCustomError(lotteryInstance, "NotExist");
    });
  });
});

import { expect } from "chai";
import { ethers, network, web3 } from "hardhat";
import { constants, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, nonce, PAUSER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldBehaveLikePausable } from "@gemunion/contracts-mocha";

import { defaultNumbers, expiresAt, externalId, extra, params } from "../../constants";
import { deployLinkVrfFixture } from "../../shared/link";
import { VRFCoordinatorMock } from "../../../typechain-types";
import { randomRequest } from "../../shared/randomRequest";
import { wrapSignature } from "./utils";
import { deployLottery } from "./fixture";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { deployERC20 } from "../../ERC20/shared/fixtures";

const delay = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

describe("Lottery", function () {
  let vrfInstance: VRFCoordinatorMock;

  const factory = () => deployLottery();

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

  describe("setTicketFactory", function () {
    it("should set factory", async function () {
      const { lotteryInstance } = await factory();
      const newTicketInstance = await deployERC721("ERC721Ticket");
      const tx = await lotteryInstance.setTicketFactory(newTicketInstance.address);
      await expect(tx).to.not.be.reverted;
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const { lotteryInstance } = await factory();
      const newTicketInstance = await deployERC721("ERC721Ticket");
      const tx = lotteryInstance.connect(receiver).setTicketFactory(newTicketInstance.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should fail: the factory must be a deployed contract", async function () {
      const { lotteryInstance } = await factory();
      const tx = lotteryInstance.setTicketFactory(constants.AddressZero);
      await expect(tx).to.be.revertedWith("Lottery: the factory must be a deployed contract");
    });
  });

  describe("setAcceptedToken", function () {
    it("should set factory", async function () {
      const { lotteryInstance } = await factory();
      const newCoinInstance = await deployERC20();
      const tx = await lotteryInstance.setAcceptedToken(newCoinInstance.address);
      await expect(tx).to.not.be.reverted;
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { lotteryInstance } = await factory();
      const newCoinInstance = await deployERC20();
      const tx = lotteryInstance.connect(receiver).setAcceptedToken(newCoinInstance.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should fail: the factory must be a deployed contract", async function () {
      const { lotteryInstance } = await factory();
      const tx = lotteryInstance.setAcceptedToken(constants.AddressZero);
      await expect(tx).to.be.revertedWith("Lottery: the factory must be a deployed contract");
    });
  });

  describe("startRound", function () {
    it("should start new round", async function () {
      const { lotteryInstance } = await factory();
      const tx = await lotteryInstance.startRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(lotteryInstance, "RoundStarted").withArgs(1, current);
    });

    it("should fail: paused", async function () {
      const { lotteryInstance } = await factory();
      lotteryInstance.startRound();
      const tx = lotteryInstance.startRound();
      await expect(tx).to.be.revertedWith("Lottery: previous round is not yet finished");
    });
  });

  describe("finishRound", function () {
    it("should end current round", async function () {
      const { lotteryInstance } = await factory();
      await lotteryInstance.startRound();

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
        await randomRequest(lotteryInstance, vrfInstance);
      }
    });

    it("should fail: previous round is already finished", async function () {
      const { lotteryInstance } = await factory();
      const tx = lotteryInstance.endRound();
      await expect(tx).to.be.revertedWith("Lottery: previous round is already finished");
    });
  });

  describe("finalizeRound", function () {
    it("should finalize round with 1 ticket", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

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

      await lotteryInstance.startRound();
      const signature = await generateSignature({
        account: receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx0 = lotteryInstance.connect(receiver).purchase(params, defaultNumbers, amount, owner.address, signature);

      await expect(tx0).to.emit(lotteryInstance, "Purchase").withArgs(1, receiver.address, amount, 1, defaultNumbers);
      // emit Purchase(tokenId, account, price, roundNumber, numbers);
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
    });
  });

  describe("purchase", function () {
    it("should purchase", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount);

      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      await lotteryInstance.startRound();
      const signature = await generateSignature({
        account: receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx = lotteryInstance.connect(receiver).purchase(params, defaultNumbers, amount, owner.address, signature);

      await expect(tx).to.emit(lotteryInstance, "Purchase").withArgs(1, receiver.address, amount, 1, defaultNumbers);
    });

    it("should release", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount);
      await erc20Instance.mint(lotteryInstance.address, utils.parseEther("20000"));

      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      if (network.name === "hardhat") {
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, lotteryInstance.address);
      }

      await lotteryInstance.startRound();
      const signature = await generateSignature({
        account: receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx = lotteryInstance.connect(receiver).purchase(params, defaultNumbers, amount, owner.address, signature);
      await expect(tx).to.emit(lotteryInstance, "Purchase").withArgs(1, receiver.address, amount, 1, defaultNumbers);

      await lotteryInstance.endRound();
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(2592)));

      const tx1 = lotteryInstance.releaseFunds(1);
      await expect(tx1).to.emit(lotteryInstance, "Released").withArgs(1, amount);
    });

    it("should fail: is not releasable yet", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount);

      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      if (network.name === "hardhat") {
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, lotteryInstance.address);
      }

      await lotteryInstance.startRound();
      const signature = await generateSignature({
        account: receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx = lotteryInstance.connect(receiver).purchase(params, defaultNumbers, amount, owner.address, signature);
      await expect(tx).to.emit(lotteryInstance, "Purchase").withArgs(1, receiver.address, amount, 1, defaultNumbers);
      await lotteryInstance.endRound();

      // TIME
      // const current = await time.latestBlock();
      // await time.advanceBlockTo(current.add(web3.utils.toBN(1)));
      //
      // const tx1 = lotteryInstance.releaseFunds(1);
      // await expect(tx1).to.be.revertedWith("Round: is not releasable yet");
    });

    it("should fail: wrong signer", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();

      const { lotteryInstance } = await factory();

      await lotteryInstance.startRound();
      const generateSignature = wrapSignature(await ethers.provider.getNetwork(), lotteryInstance, stranger);
      const signature = await generateSignature({
        account: receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx = lotteryInstance
        .connect(receiver)
        .purchase(params, defaultNumbers, amount, stranger.address, signature);
      await expect(tx).to.be.revertedWith("Lottery: Wrong signer");
    });

    it("should fail: wrong signature", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance } = await factory();

      await lotteryInstance.startRound();
      const signature = utils.formatBytes32String("signature");

      const tx = lotteryInstance.connect(receiver).purchase(params, defaultNumbers, amount, owner.address, signature);
      await expect(tx).to.be.revertedWith("Lottery: Invalid signature");
    });

    it("should fail: expired signature", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount);

      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      await lotteryInstance.startRound();
      const signature = await generateSignature({
        account: receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx1 = lotteryInstance.connect(receiver).purchase(params, defaultNumbers, amount, owner.address, signature);
      await expect(tx1).to.emit(lotteryInstance, "Purchase").withArgs(1, receiver.address, amount, 1, defaultNumbers);

      const tx2 = lotteryInstance.connect(receiver).purchase(params, defaultNumbers, amount, owner.address, signature);
      await expect(tx2).to.be.revertedWith("Lottery: Expired signature");
    });

    it("should fail: insufficient allowance", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature } = await factory();

      await lotteryInstance.startRound();
      const signature = await generateSignature({
        account: receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount * 2,
      });

      const tx = lotteryInstance
        .connect(receiver)
        .purchase(params, defaultNumbers, amount * 2, owner.address, signature);
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should fail: transfer amount exceeds balance", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance } = await factory();

      await lotteryInstance.startRound();
      const signature = await generateSignature({
        account: receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount * 2,
      });

      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount * 2);

      const tx = lotteryInstance
        .connect(receiver)
        .purchase(params, defaultNumbers, amount * 2, owner.address, signature);

      await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should fail: no more tickets available", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

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

      await lotteryInstance.startRound();

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
        numbers: defaultNumbers,
        price: amount,
      });

      const tx1 = lotteryInstance
        .connect(receiver)
        .purchase(params1, defaultNumbers, amount, owner.address, signature1);
      await expect(tx1).to.emit(lotteryInstance, "Purchase").withArgs(1, receiver.address, amount, 1, defaultNumbers);

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
        numbers: defaultNumbers,
        price: amount,
      });

      const tx2 = lotteryInstance
        .connect(stranger)
        .purchase(params2, defaultNumbers, amount, owner.address, signature2);
      await expect(tx2).to.emit(lotteryInstance, "Purchase").withArgs(2, stranger.address, amount, 1, defaultNumbers);

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
        numbers: defaultNumbers,
        price: amount,
      });

      const tx3 = lotteryInstance
        .connect(stranger)
        .purchase(params3, defaultNumbers, amount, owner.address, signature3);
      await expect(tx3).to.be.revertedWith("Lottery: no more tickets available");
    });

    it("should fail: current round is finished", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const { lotteryInstance, generateSignature, erc20Instance, erc721Instance } = await factory();

      await erc20Instance.mint(receiver.address, amount);
      await erc20Instance.connect(receiver).approve(lotteryInstance.address, amount);

      await erc721Instance.grantRole(MINTER_ROLE, lotteryInstance.address);

      if (network.name === "hardhat") {
        const tx02 = vrfInstance.addConsumer(1, lotteryInstance.address);
        await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, lotteryInstance.address);
      }

      await lotteryInstance.startRound();
      const tx0 = await lotteryInstance.endRound();

      const current: number = (await time.latest()).toNumber();
      await expect(tx0).to.emit(lotteryInstance, "RoundEnded").withArgs(1, current);

      const signature = await generateSignature({
        account: receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx = lotteryInstance.connect(receiver).purchase(params, defaultNumbers, amount, owner.address, signature);
      await expect(tx).to.be.revertedWith("Lottery: current round is finished");
    });
  });

  describe("get prize", function () {
    it("should get prize: Jackpot 1 ticket", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const values = [0, 1, 2, 3, 5, 8];
      const aggregation = [0, 0, 0, 0, 0, 0, 1];

      const { lotteryInstance, erc721Instance, erc20Instance } = await factory();

      await erc721Instance.mintTicket(receiver.address, 1, defaultNumbers);
      await erc721Instance.connect(receiver).approve(lotteryInstance.address, 1);
      await erc20Instance.mint(lotteryInstance.address, utils.parseEther("20000"));

      await lotteryInstance.setDummyRound(defaultNumbers, values, aggregation, nonce);

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

      await erc721Instance.mintTicket(receiver.address, 1, defaultNumbers);
      await erc721Instance.connect(receiver).approve(lotteryInstance.address, 1);
      await erc20Instance.mint(lotteryInstance.address, utils.parseEther("20000"));

      await lotteryInstance.setDummyRound(defaultNumbers, values, aggregation, nonce);
      // await lotteryInstance.setDummyTicket(defaultNumbers);

      const prizeAmount = constants.WeiPerEther.mul(3500).sub(200); // rounding error

      const tx = lotteryInstance.connect(receiver).getPrize(1);
      await expect(tx).to.emit(lotteryInstance, "Prize").withArgs(receiver.address, 1, prizeAmount);
    });
  });
});

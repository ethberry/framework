import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers, network, web3 } from "hardhat";
import { BigNumber, constants, utils } from "ethers";
import { Network } from "@ethersproject/networks";
import { time } from "@openzeppelin/test-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import {
  amount,
  baseTokenURI,
  decimals,
  DEFAULT_ADMIN_ROLE,
  defaultNumbers,
  expiresAt,
  externalId,
  LINK_ADDR,
  MINTER_ROLE,
  nonce,
  params,
  PAUSER_ROLE,
  royalty,
  tokenName,
  tokenSymbol,
  VRF_ADDR,
} from "../../constants";
import { deployLinkVrfFixture } from "../../shared/link";

import { LinkErc20, VRFCoordinatorMock } from "../../../typechain-types";
import { shouldRevokeRole } from "../../shared/accessControl/revokeRole";
import { shouldPause } from "../../shared/pausable";
import { shouldRenounceRole } from "../../shared/accessControl/renounceRole";
import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "../../shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "../../shared/accessControl/grantRole";
import { randomRequest } from "../../shared/randomRequest";
import { getContractName } from "../../utils";
import { wrapSignature } from "./utils";

const delay = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

use(solidity);

describe("Lottery", function () {
  let etherNetwork: Network;
  let linkInstance: LinkErc20;
  let vrfInstance: VRFCoordinatorMock;
  this.timeout(999999);

  let generateSignature: (values: Record<string, any>) => Promise<string>;

  before(async function () {
    if (network.name === "hardhat") {
      await network.provider.send("hardhat_reset");

      // https://github.com/NomicFoundation/hardhat/issues/2980
      ({ linkInstance, vrfInstance } = await loadFixture(function chainlink() {
        return deployLinkVrfFixture();
      }));

      expect(linkInstance.address).equal(LINK_ADDR);
      expect(vrfInstance.address).equal(VRF_ADDR);
    }
  });

  beforeEach(async function () {
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    this.erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, utils.parseEther("2000000"));

    await this.erc20Instance.deployed();

    const erc721TicketFactory = await ethers.getContractFactory("ERC721Ticket");
    this.erc721TicketInstance = await erc721TicketFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    await this.erc721TicketInstance.deployed();

    const lotteryFactory = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));

    this.lotteryInstance = await lotteryFactory.deploy(
      tokenName,
      this.erc721TicketInstance.address,
      this.erc20Instance.address,
    );

    await this.lotteryInstance.deployed();

    this.erc721TicketInstance.grantRole(DEFAULT_ADMIN_ROLE, this.lotteryInstance.address);
    this.erc721TicketInstance.grantRole(MINTER_ROLE, this.lotteryInstance.address);

    etherNetwork = await ethers.provider.getNetwork();

    generateSignature = wrapSignature(etherNetwork, this.lotteryInstance, this.owner);

    this.contractInstance = this.lotteryInstance;

    // Fund LINK to Lottery contract
    if (network.name === "hardhat") {
      await linkInstance.transfer(this.lotteryInstance.address, BigNumber.from("1000").mul(decimals));
    }
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();
  shouldPause();

  describe("setTicketFactory", function () {
    beforeEach(async function () {
      const newTicketFactory = await ethers.getContractFactory("ERC721Ticket");
      this.newTicketInstance = await newTicketFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    });

    it("should set factory", async function () {
      const tx = await this.lotteryInstance.setTicketFactory(this.newTicketInstance.address);
      await expect(tx).to.not.be.reverted;
    });

    it("should fail: account is missing role", async function () {
      const tx = this.lotteryInstance.connect(this.receiver).setTicketFactory(this.newTicketInstance.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should fail: the factory must be a deployed contract", async function () {
      const tx = this.lotteryInstance.setTicketFactory(constants.AddressZero);
      await expect(tx).to.be.revertedWith("Lottery: the factory must be a deployed contract");
    });
  });

  describe("setAcceptedToken", function () {
    beforeEach(async function () {
      const newCoinFactory = await ethers.getContractFactory("ERC20Simple");
      this.newCoinInstance = await newCoinFactory.deploy(tokenName, tokenSymbol, utils.parseEther("2000000"));
    });

    it("should set factory", async function () {
      const tx = await this.lotteryInstance.setAcceptedToken(this.newCoinInstance.address);
      await expect(tx).to.not.be.reverted;
    });

    it("should fail: account is missing role", async function () {
      const tx = this.lotteryInstance.connect(this.receiver).setAcceptedToken(this.newCoinInstance.address);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should fail: the factory must be a deployed contract", async function () {
      const tx = this.lotteryInstance.setAcceptedToken(constants.AddressZero);
      await expect(tx).to.be.revertedWith("Lottery: the factory must be a deployed contract");
    });
  });

  describe("startRound", function () {
    it("should start new round", async function () {
      const tx = await this.lotteryInstance.startRound();
      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(this.lotteryInstance, "RoundStarted").withArgs(1, current);
    });

    it("should fail: paused", async function () {
      this.lotteryInstance.startRound();
      const tx = this.lotteryInstance.startRound();
      await expect(tx).to.be.revertedWith("Lottery: previous round is not yet finished");
    });
  });

  describe("finishRound", function () {
    it("should end current round", async function () {
      await this.lotteryInstance.startRound();
      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }
      const tx = await this.lotteryInstance.endRound();
      await expect(tx).to.emit(this.lotteryInstance, "RandomRequest");
      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      if (network.name === "hardhat") {
        // RANDOM
        await randomRequest(this.lotteryInstance, vrfInstance);
      }

      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(this.lotteryInstance, "RoundEnded").withArgs(1, current);
    });

    it("should fail: previous round is already finished", async function () {
      const tx = this.lotteryInstance.endRound();
      await expect(tx).to.be.revertedWith("Lottery: previous round is already finished");
    });
  });

  describe.only("finalizeRound", function () {
    beforeEach(async function () {
      // await this.erc20Instance.mint(this.receiver.address, amount);
      // await this.erc20Instance.connect(this.receiver).approve(this.lotteryInstance.address, amount);

      await this.erc20Instance.mint(this.receiver.address, amount);
      await this.erc20Instance.connect(this.receiver).approve(this.lotteryInstance.address, amount);

      await this.erc20Instance.mint(this.stranger.address, amount);
      await this.erc20Instance.connect(this.stranger).approve(this.lotteryInstance.address, amount);

      await this.erc20Instance.mint(this.lotteryInstance.address, utils.parseEther("20000"));
    });

    it("should finalize round with tickets", async function () {
      await this.lotteryInstance.startRound();
      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx0 = this.lotteryInstance
        .connect(this.receiver)
        .purchase(params, defaultNumbers, amount, this.owner.address, signature);

      await expect(tx0)
        .to.emit(this.lotteryInstance, "Purchase")
        .withArgs(this.receiver.address, amount, 1, defaultNumbers);

      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      const tx = await this.lotteryInstance.endRound();
      await expect(tx).to.emit(this.lotteryInstance, "RandomRequest");
      if (network.name !== "hardhat") {
        await delay(10000).then(() => console.info("delay 10000 done"));
      }

      if (network.name === "hardhat") {
        // RANDOM
        await randomRequest(this.lotteryInstance, vrfInstance);
      }

      const current: number = (await time.latest()).toNumber();
      await expect(tx).to.emit(this.lotteryInstance, "RoundEnded").withArgs(1, current);
      const eventFilter = this.lotteryInstance.filters.RoundFinalized();
      const events = await this.lotteryInstance.queryFilter(eventFilter);
      expect(events.length).to.be.greaterThan(0);
      console.info("winValues", events[0].args.winValues);
      expect(events[0].args.round).to.equal(1);
    });
  });

  describe("purchase", function () {
    beforeEach(async function () {
      // await this.erc20Instance.mint(this.receiver.address, amount);
      // await this.erc20Instance.connect(this.receiver).approve(this.lotteryInstance.address, amount);

      await this.erc20Instance.mint(this.receiver.address, amount);
      await this.erc20Instance.connect(this.receiver).approve(this.lotteryInstance.address, amount);

      await this.erc20Instance.mint(this.stranger.address, amount);
      await this.erc20Instance.connect(this.stranger).approve(this.lotteryInstance.address, amount);

      await this.erc20Instance.mint(this.lotteryInstance.address, utils.parseEther("20000"));
    });

    it("should purchase", async function () {
      await this.lotteryInstance.startRound();
      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx = this.lotteryInstance
        .connect(this.receiver)
        .purchase(params, defaultNumbers, amount, this.owner.address, signature);

      await expect(tx)
        .to.emit(this.lotteryInstance, "Purchase")
        .withArgs(this.receiver.address, amount, 1, defaultNumbers);
    });

    it("should release", async function () {
      await this.lotteryInstance.startRound();
      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx = this.lotteryInstance
        .connect(this.receiver)
        .purchase(params, defaultNumbers, amount, this.owner.address, signature);
      await expect(tx)
        .to.emit(this.lotteryInstance, "Purchase")
        .withArgs(this.receiver.address, amount, 1, defaultNumbers);

      await this.lotteryInstance.endRound();
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(2592)));

      const tx1 = this.lotteryInstance.releaseFunds(1);
      await expect(tx1).to.emit(this.lotteryInstance, "Released").withArgs(1, amount);
    });

    it("should fail: is not releasable yet", async function () {
      await this.lotteryInstance.startRound();
      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx = this.lotteryInstance
        .connect(this.receiver)
        .purchase(params, defaultNumbers, amount, this.owner.address, signature);
      await expect(tx)
        .to.emit(this.lotteryInstance, "Purchase")
        .withArgs(this.receiver.address, amount, 1, defaultNumbers);
      await this.lotteryInstance.endRound();

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(1)));

      const tx1 = this.lotteryInstance.releaseFunds(1);
      await expect(tx1).to.be.revertedWith("Round: is not releasable yet");
    });

    it("should fail: wrong signer", async function () {
      await this.lotteryInstance.startRound();
      generateSignature = wrapSignature(etherNetwork, this.lotteryInstance, this.stranger);
      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx = this.lotteryInstance
        .connect(this.receiver)
        .purchase(params, defaultNumbers, amount, this.stranger.address, signature);
      await expect(tx).to.be.revertedWith("Lottery: Wrong signer");
    });

    it("should fail: wrong signature", async function () {
      await this.lotteryInstance.startRound();
      const signature = utils.formatBytes32String("signature");

      const tx = this.lotteryInstance
        .connect(this.receiver)
        .purchase(params, defaultNumbers, amount, this.owner.address, signature);
      await expect(tx).to.be.revertedWith("Lottery: Invalid signature");
    });

    it("should fail: expired signature", async function () {
      await this.lotteryInstance.startRound();
      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx1 = this.lotteryInstance
        .connect(this.receiver)
        .purchase(params, defaultNumbers, amount, this.owner.address, signature);
      await expect(tx1)
        .to.emit(this.lotteryInstance, "Purchase")
        .withArgs(this.receiver.address, amount, 1, defaultNumbers);

      const tx2 = this.lotteryInstance
        .connect(this.receiver)
        .purchase(params, defaultNumbers, amount, this.owner.address, signature);
      await expect(tx2).to.be.revertedWith("Lottery: Expired signature");
    });

    it("should fail: insufficient allowance", async function () {
      await this.lotteryInstance.startRound();
      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount * 2,
      });

      const tx = this.lotteryInstance
        .connect(this.receiver)
        .purchase(params, defaultNumbers, amount * 2, this.owner.address, signature);
      await expect(tx).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("should fail: transfer amount exceeds balance", async function () {
      await this.lotteryInstance.startRound();
      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount * 2,
      });

      await this.erc20Instance.connect(this.receiver).approve(this.lotteryInstance.address, amount * 2);

      const tx = this.lotteryInstance
        .connect(this.receiver)
        .purchase(params, defaultNumbers, amount * 2, this.owner.address, signature);

      await expect(tx).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should fail: no more tickets available", async function () {
      await this.lotteryInstance.startRound();

      const params1 = {
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: constants.AddressZero,
      };
      const signature1 = await generateSignature({
        account: this.receiver.address,
        params: params1,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx1 = this.lotteryInstance
        .connect(this.receiver)
        .purchase(params1, defaultNumbers, amount, this.owner.address, signature1);
      await expect(tx1)
        .to.emit(this.lotteryInstance, "Purchase")
        .withArgs(this.receiver.address, amount, 1, defaultNumbers);

      const params2 = {
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: constants.AddressZero,
      };
      const signature2 = await generateSignature({
        account: this.stranger.address,
        params: params2,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx2 = this.lotteryInstance
        .connect(this.stranger)
        .purchase(params2, defaultNumbers, amount, this.owner.address, signature2);
      await expect(tx2)
        .to.emit(this.lotteryInstance, "Purchase")
        .withArgs(this.stranger.address, amount, 1, defaultNumbers);

      const params3 = {
        nonce: utils.randomBytes(32),
        externalId,
        expiresAt,
        referrer: constants.AddressZero,
      };
      const signature3 = await generateSignature({
        account: this.stranger.address,
        params: params3,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx3 = this.lotteryInstance
        .connect(this.stranger)
        .purchase(params3, defaultNumbers, amount, this.owner.address, signature3);
      await expect(tx3).to.be.revertedWith("Lottery: no more tickets available");
    });

    it("should fail: current round is finished", async function () {
      await this.lotteryInstance.startRound();
      const tx0 = await this.lotteryInstance.endRound();
      await expect(tx0).to.emit(this.lotteryInstance, "RandomRequest");
      const current: number = (await time.latest()).toNumber();
      await expect(tx0).to.emit(this.lotteryInstance, "RoundEnded").withArgs(1, current);

      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        numbers: defaultNumbers,
        price: amount,
      });

      const tx = this.lotteryInstance
        .connect(this.receiver)
        .purchase(params, defaultNumbers, amount, this.owner.address, signature);
      await expect(tx).to.be.revertedWith("Lottery: current round is finished");
    });
  });

  describe("get prize", function () {
    beforeEach(async function () {
      await this.erc721TicketInstance.mintTicket(this.receiver.address, 1, defaultNumbers);
      await this.erc721TicketInstance.connect(this.receiver).approve(this.lotteryInstance.address, 1);
      await this.erc20Instance.mint(this.lotteryInstance.address, utils.parseEther("20000"));
    });

    it("should get prize: Jackpot 1 ticket", async function () {
      const values = [0, 1, 2, 3, 5, 8];
      const aggregation = [0, 0, 0, 0, 0, 0, 1];

      await this.lotteryInstance.setDummyRound(defaultNumbers, values, aggregation, nonce);

      await this.erc721TicketInstance.connect(this.receiver).approve(this.lotteryInstance.address, 1);

      const prizeAmount = constants.WeiPerEther.mul(7000).sub(180); // rounding error

      const tx = this.lotteryInstance.connect(this.receiver).getPrize(1);
      await expect(tx).to.emit(this.lotteryInstance, "Prize").withArgs(this.receiver.address, 1, prizeAmount);
    });

    it("should get prize: Jackpot 2 tickets", async function () {
      const values = [0, 1, 2, 3, 5, 8];
      const aggregation = [0, 0, 0, 0, 0, 0, 2];

      await this.lotteryInstance.setDummyRound(defaultNumbers, values, aggregation, nonce);
      // await this.lotteryInstance.setDummyTicket(defaultNumbers);

      const prizeAmount = constants.WeiPerEther.mul(3500).sub(200); // rounding error

      const tx = this.lotteryInstance.connect(this.receiver).getPrize(1);
      await expect(tx).to.emit(this.lotteryInstance, "Prize").withArgs(this.receiver.address, 1, prizeAmount);
    });
  });
});

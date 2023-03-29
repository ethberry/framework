import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers, network, web3 } from "hardhat";
import { constants, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { shouldBehaveLikeAccessControl, shouldBehaveLikePausable } from "@gemunion/contracts-mocha";
import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE, TEMPLATE_ID } from "@gemunion/contracts-constants";

import { IERC721Random, VRFCoordinatorMock } from "../../../typechain-types";
import { templateId, tokenId } from "../../constants";
import { IRule } from "./interface/staking";
import { randomRequest } from "../../shared/randomRequest";
import { deployLinkVrfFixture } from "../../shared/link";
import { deployStaking } from "./shared/fixture";
import { deployERC20 } from "../../ERC20/shared/fixtures";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { deployERC1155 } from "../../ERC1155/shared/fixtures";

use(solidity);

describe("StakingRefferal", function () {
  const period = 300;
  const penalty = 0;
  const cycles = 2;

  let vrfInstance: VRFCoordinatorMock;

  const factory = () => deployStaking("StakingReferral");
  const erc20Factory = () => deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
  const erc721Factory = (name: string) => deployERC721(name);
  const erc1155Factory = () => deployERC1155();

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldBehaveLikePausable(factory);

  before(async function () {
    await network.provider.send("hardhat_reset");

    // https://github.com/NomicFoundation/hardhat/issues/2980
    ({ vrfInstance } = await loadFixture(function staking() {
      return deployLinkVrfFixture();
    }));
  });

  after(async function () {
    await network.provider.send("hardhat_reset");
  });

  describe("setRule", function () {
    it("should fail for wrong role", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount: 0,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.connect(receiver).setRules([stakeRule]);

      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should fail edit when Rule not exist", async function () {
      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.updateRule(2, false);
      await expect(tx1).to.be.revertedWith("Staking: rule does not exist");
    });

    it("should set one Rule", async function () {
      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
    });

    it("should set multiple Rules", async function () {
      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");
      const mysteryboxInstance = await erc721Factory("ERC721MysteryboxSimple");

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount: 0,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 2,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: mysteryboxInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [
          [
            {
              tokenType: 2, // ERC721
              token: erc721SimpleInstance.address,
              tokenId,
              amount,
            },
          ],
        ],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // todo count Events?
    });

    it("should edit Rule", async function () {
      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.updateRule(1, false);
      await expect(tx1).to.emit(stakingInstance, "RuleUpdated").withArgs(1, false);
    });
  });

  describe("Stake", function () {
    it("should fail for not existing rule", async function () {
      const [_owner, _receiver, stranger] = await ethers.getSigners();
      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(stranger.address, 2, tokenId, { value: 100 });
      await expect(tx1).to.be.revertedWith("Staking: rule doesn't exist");
    });

    it("should fail for not active rule", async function () {
      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");
      const [_owner, _receiver, stranger] = await ethers.getSigners();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: false,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(stranger.address, 1, tokenId, { value: amount });
      await expect(tx1).to.be.revertedWith("Staking: rule doesn't active");
    });

    it("should fail for wrong pay amount", async function () {
      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");
      const [_owner, _receiver, stranger] = await ethers.getSigners();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(stranger.address, 1, tokenId, { value: 100 });
      await expect(tx1).to.be.revertedWith("Exchange: Wrong amount");
    });

    it("should fail for limit exceed", async function () {
      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");
      const [_owner, _receiver, stranger] = await ethers.getSigners();

      await stakingInstance.setMaxStake(1);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(stranger.address, 1, tokenId, { value: amount });
      await expect(tx1).to.not.be.reverted;

      const tx2 = stakingInstance.deposit(stranger.address, 1, tokenId, { value: amount });
      await expect(tx2).to.be.revertedWith("Staking: stake limit exceeded");
    });
  });

  describe("Reward", function () {
    it("should fail for wrong staking id", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        content: [],
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = await stakingInstance.connect(receiver).deposit(stranger.address, 1, tokenId, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, receiver.address, startTimestamp, tokenId)
        .to.changeEtherBalances([receiver, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = stakingInstance.connect(receiver).receiveReward(2, true, true);
      await expect(tx2).to.be.revertedWith("Staking: wrong staking id");
    });

    it("should fail for not an owner", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        content: [],
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.connect(receiver).deposit(stranger.address, 1, tokenId, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, receiver.address, startTimestamp, tokenId)
        .to.changeEtherBalances([receiver, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = stakingInstance.receiveReward(1, true, true);
      await expect(tx2).to.be.revertedWith("Staking: not an owner");
    });

    it("should fail for withdrawn already", async function () {
      const [_owner, receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        content: [],
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.connect(receiver).deposit(stranger.address, 1, tokenId, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, receiver.address, startTimestamp, tokenId)
        .to.changeEtherBalances([receiver, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await stakingInstance.connect(receiver).receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, receiver.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, receiver.address, endTimestamp, cycles)
        .to.changeEtherBalance(receiver, amount * cycles + amount);

      const tx3 = stakingInstance.connect(receiver).receiveReward(1, true, true);
      await expect(tx3).to.be.revertedWith("Staking: deposit withdrawn already");
    });

    it("should fail deposit for wrong tokenId", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      await erc721RandomInstance.mintCommon(owner.address, templateId);
      await erc721RandomInstance.mintCommon(owner.address, templateId + 1);
      const balance = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance).to.equal(2);
      expect(await erc721RandomInstance.getRecordFieldValue(1, TEMPLATE_ID)).to.equal(templateId);
      expect(await erc721RandomInstance.getRecordFieldValue(2, TEMPLATE_ID)).to.equal(templateId + 1);

      // APPROVE
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      await erc721RandomInstance.approve(stakingInstance.address, 2);

      // DEPOSIT
      const tx1 = stakingInstance.deposit(stranger.address, 1, 1 + 1);
      await expect(tx1).to.be.revertedWith("Staking: wrong deposit token templateID");
    });
  });

  describe("Permutations", function () {
    it("should stake NATIVE & receive NATIVE", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        content: [],
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.changeEtherBalances([owner, stakingInstance], [amount * cycles + amount, -amount * cycles - amount]);
    });

    it("should stake NATIVE & receive ERC20", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // REWARD
      await erc20Instance.mint(stakingInstance.address, amount * cycles);
      const balance1 = await erc20Instance.balanceOf(stakingInstance.address);
      expect(balance1).to.equal(amount * cycles);
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, amount * cycles)
        .to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(amount * cycles);
    });

    it("should stake NATIVE & receive ERC721 Random", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
      await erc721RandomInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      // Add Consumer to VRFV2
      const tx02 = vrfInstance.addConsumer(1, erc721RandomInstance.address);
      await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721RandomInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(vrfInstance, "RandomWordsRequested")
        .to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      // RANDOM
      await randomRequest(erc721RandomInstance as IERC721Random, vrfInstance);
      const balance = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance).to.equal(cycles);
    });

    it("should stake NATIVE & receive ERC721 Common", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721SimpleInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(constants.AddressZero, owner.address, tokenId)
        .to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      const balance = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance).to.equal(cycles);
    });

    it("should stake NATIVE & receive ERC721 Mysterybox", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const mysteryboxInstance = await erc721Factory("ERC721MysteryboxSimple");

      await mysteryboxInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: mysteryboxInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [
          [
            {
              tokenType: 2, // ERC721
              token: erc721SimpleInstance.address,
              tokenId,
              amount: 0,
            },
          ],
        ],
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(constants.AddressZero, owner.address, tokenId)
        .to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      const balance = await mysteryboxInstance.balanceOf(owner.address);
      expect(balance).to.equal(cycles);
    });

    it("should stake NATIVE & receive ERC1155", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc1155Instance = await erc1155Factory();

      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 4, // ERC1155
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, constants.AddressZero, owner.address, tokenId, amount * cycles)
        .to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      const balance = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance).to.equal(amount * cycles);
    });

    it("should stake ERC20 & receive NATIVE", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(owner.address, amount);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(amount);
      await erc20Instance.approve(stakingInstance.address, amount);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenId)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x");

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.changeEtherBalances([owner, stakingInstance], [amount * cycles, -amount * cycles]);

      const balance3 = await erc20Instance.balanceOf(owner.address);
      expect(balance3).to.equal(amount);
    });

    it("should stake ERC20 & receive ERC20", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(owner.address, amount);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(amount);
      await erc20Instance.approve(stakingInstance.address, amount);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenId)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x");

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await erc20Instance.mint(stakingInstance.address, amount * cycles);
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, amount * cycles);

      const balance3 = await erc20Instance.balanceOf(owner.address);
      expect(balance3).to.equal(amount * cycles + amount);
    });

    it("should stake ERC20 & receive ERC721 Random", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
      await erc721RandomInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      // Add Consumer to VRFV2
      const tx02 = vrfInstance.addConsumer(1, erc721RandomInstance.address);
      await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721RandomInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(owner.address, amount);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(amount);
      await erc20Instance.approve(stakingInstance.address, amount);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenId)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x");

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(vrfInstance, "RandomWordsRequested");

      // RANDOM
      await randomRequest(erc721RandomInstance as IERC721Random, vrfInstance);
      const balance3 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance3).to.equal(cycles);
      const balance4 = await erc20Instance.balanceOf(owner.address);
      expect(balance4).to.equal(amount);
    });

    it("should stake ERC20 & receive ERC721 Common", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721SimpleInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(owner.address, amount);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(amount);
      await erc20Instance.approve(stakingInstance.address, amount);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenId)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x");

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(constants.AddressZero, owner.address, tokenId);

      const balance3 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance3).to.equal(cycles);
      const balance4 = await erc20Instance.balanceOf(owner.address);
      expect(balance4).to.equal(amount);
    });

    it("should stake ERC20 & receive ERC721 Mysterybox", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const mysteryboxInstance = await erc721Factory("ERC721MysteryboxSimple");

      await mysteryboxInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: mysteryboxInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [
          [
            {
              tokenType: 2, // ERC721
              token: erc721SimpleInstance.address,
              tokenId,
              amount: 0,
            },
          ],
        ],
        period,
        penalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(owner.address, amount);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(amount);
      await erc20Instance.approve(stakingInstance.address, amount);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenId)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x");

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(constants.AddressZero, owner.address, tokenId);

      const balance3 = await mysteryboxInstance.balanceOf(owner.address);
      expect(balance3).to.equal(cycles);
      const balance4 = await erc20Instance.balanceOf(owner.address);
      expect(balance4).to.equal(amount);
    });

    it("should stake ERC20 & receive ERC1155", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc1155Instance = await erc1155Factory();

      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 4, // ERC1155
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(owner.address, amount);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(amount);
      await erc20Instance.approve(stakingInstance.address, amount);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenId)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x");

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, constants.AddressZero, owner.address, tokenId, amount * cycles);

      const balance3 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance3).to.equal(amount * cycles);
      const balance4 = await erc20Instance.balanceOf(owner.address);
      expect(balance4).to.equal(amount);
    });

    it("should stake ERC721 & receive NATIVE", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
      await erc721RandomInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(owner.address, templateId);
      const balance1 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance1).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.emit(erc721RandomInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId);

      const balance2 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.changeEtherBalances([owner, stakingInstance], [amount * cycles, -amount * cycles]);

      const balance3 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance3).to.equal(1);
    });

    it("should stake ERC721 & receive ERC20", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(owner.address, templateId);
      const balance1 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance1).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.emit(erc721RandomInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId);

      const balance2 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await erc20Instance.mint(stakingInstance.address, amount * cycles);
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, amount * cycles);

      const balance3 = await erc20Instance.balanceOf(owner.address);
      expect(balance3).to.equal(amount * cycles);
      const balance4 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance4).to.equal(1);
    });

    it("should stake ERC721 & receive ERC721 Random", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
      await erc721RandomInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      // Add Consumer to VRFV2
      const tx02 = vrfInstance.addConsumer(1, erc721RandomInstance.address);
      await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721RandomInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(owner.address, templateId);
      const balance1 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance1).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.emit(erc721RandomInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId);
      const balance2 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(vrfInstance, "RandomWordsRequested");

      // RANDOM
      await randomRequest(erc721RandomInstance as IERC721Random, vrfInstance);
      const balance3 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance3).to.equal(cycles + 1);
    });

    it("should stake ERC721 & receive ERC721 Common", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721SimpleInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(owner.address, templateId);
      const balance1 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance1).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.emit(erc721RandomInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId);

      const balance2 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(constants.AddressZero, owner.address, tokenId);

      const balance3 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance3).to.equal(cycles);
      const balance4 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance4).to.equal(1);
    });

    it("should stake ERC721 & receive ERC721 Mysterybox", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");
      const mysteryboxInstance = await erc721Factory("ERC721MysteryboxSimple");

      await mysteryboxInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount: 0,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: mysteryboxInstance.address,
            tokenId,
            amount: 0,
          },
        ],
        content: [
          [
            {
              tokenType: 2, // ERC721
              token: erc721SimpleInstance.address,
              tokenId,
              amount: 0,
            },
          ],
        ],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(owner.address, templateId);
      const balance1 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance1).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.emit(erc721RandomInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId);
      const balance2 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(constants.AddressZero, owner.address, tokenId);
      const balance3 = await mysteryboxInstance.balanceOf(owner.address);
      expect(balance3).to.equal(cycles);
      const balance4 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance4).to.equal(1);
    });

    it("should stake ERC721 & receive ERC1155", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");
      const erc1155Instance = await erc1155Factory();

      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 4, // ERC1155
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(owner.address, templateId);
      const balance1 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance1).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.emit(erc721RandomInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId);

      const balance2 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, constants.AddressZero, owner.address, tokenId, amount * cycles);

      const balance3 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance3).to.equal(amount * cycles);
      const balance4 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance4).to.equal(1);
    });

    it("should stake ERC1155 & receive NATIVE", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc1155Instance = await erc1155Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 4, // ERC1155
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc1155Instance.mint(owner.address, 1, amount, "0x");
      const balance1 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance1).to.equal(amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, owner.address, stakingInstance.address, tokenId, amount);

      const balance2 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.changeEtherBalances([owner, stakingInstance], [amount * cycles, -amount * cycles]);

      const balance3 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance3).to.equal(amount);
    });

    it("should stake ERC1155 & receive ERC20", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc1155Instance = await erc1155Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 4, // ERC1155
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc1155Instance.mint(owner.address, 1, amount, "0x");
      const balance1 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance1).to.equal(amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, owner.address, stakingInstance.address, tokenId, amount);

      const balance2 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await erc20Instance.mint(stakingInstance.address, amount * cycles);
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, amount * cycles);

      const balance3 = await erc20Instance.balanceOf(owner.address);
      expect(balance3).to.equal(amount * cycles);
      const balance4 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance4).to.equal(amount);
    });

    it("should stake ERC1155 & receive ERC721 Random", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");
      const erc1155Instance = await erc1155Factory();

      await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
      await erc721RandomInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      // Add Consumer to VRFV2
      const tx02 = vrfInstance.addConsumer(1, erc721RandomInstance.address);
      await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721RandomInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 4, // ERC1155
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721RandomInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc1155Instance.mint(owner.address, 1, amount, "0x");
      const balance1 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance1).to.equal(amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, owner.address, stakingInstance.address, tokenId, amount);

      const balance2 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(vrfInstance, "RandomWordsRequested");

      // RANDOM
      await randomRequest(erc721RandomInstance as IERC721Random, vrfInstance);
      const balance3 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance3).to.equal(2);
      const balance4 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance4).to.equal(amount);
    });

    it("should stake ERC1155 & receive ERC721 Common", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const erc1155Instance = await erc1155Factory();

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 4, // ERC1155
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721SimpleInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc1155Instance.mint(owner.address, 1, amount, "0x");
      const balance1 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance1).to.equal(amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, owner.address, stakingInstance.address, tokenId, amount);

      const balance2 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(constants.AddressZero, owner.address, tokenId);

      const balance3 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance3).to.equal(cycles);
      const balance4 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance4).to.equal(amount);
    });

    it("should stake ERC1155 & receive ERC721 Mysterybox", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const mysteryboxInstance = await erc721Factory("ERC721MysteryboxSimple");
      const erc1155Instance = await erc1155Factory();

      await mysteryboxInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 4, // ERC1155
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: mysteryboxInstance.address,
            tokenId,
            amount: 0,
          },
        ],
        content: [
          [
            {
              tokenType: 2, // ERC721
              token: erc721SimpleInstance.address,
              tokenId,
              amount: 0,
            },
          ],
        ],
        period,
        penalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc1155Instance.mint(owner.address, 1, amount, "0x");
      const balance1 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance1).to.equal(amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, owner.address, stakingInstance.address, tokenId, amount);

      const balance2 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(constants.AddressZero, owner.address, tokenId);
      const balance3 = await mysteryboxInstance.balanceOf(owner.address);
      expect(balance3).to.equal(cycles);
      const balance4 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance4).to.equal(amount);
    });

    it("should stake ERC1155 & receive ERC1155", async function () {
      const [owner, _receiver, stranger] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc1155Instance = await erc1155Factory();

      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        externalId: 1,
        deposit: [
          {
            tokenType: 4, // ERC1155
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 4, // ERC1155
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        content: [],
        period,
        penalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc1155Instance.mint(owner.address, 1, amount, "0x");
      const balance1 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance1).to.equal(amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const tx1 = await stakingInstance.deposit(stranger.address, 1, tokenId);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenId)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, owner.address, stakingInstance.address, tokenId, amount);

      const balance2 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, constants.AddressZero, owner.address, tokenId, amount * cycles);

      const balance3 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance3).to.equal(amount * cycles + amount);
    });
  });

  // todo test recurrent
});

import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers, waffle, web3 } from "hardhat";
import { constants, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { DEFAULT_ADMIN_ROLE, PAUSER_ROLE } from "@gemunion/contracts-constants";

import { ERC20Simple, Pyramid } from "../../../typechain-types";
import { _stakePeriod, tokenZero } from "../../constants";
import { IAsset, IRule } from "./interface/staking";

use(solidity);

describe("Pyramid", function () {
  let pyramidInstance: Pyramid;

  let erc20Instance: ERC20Simple;
  let stakePeriod: number;
  let stakePenalty: number;
  let stakeCycles: number;
  let nativeDeposit: IAsset;
  let nativeReward: IAsset;
  let erc20Deposit: IAsset;
  let erc20Reward: IAsset;

  this.timeout(142000);

  const refProgram = {
    maxRefs: 10,
    refReward: 10 * 100, // 10.00 %
    refDecrease: 10, // 10% - 1% - 0.1% - 0.01% etc.
  };

  beforeEach(async function () {
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();
    this.provider = waffle.provider;

    // Pyramid
    const pyramidFactory = await ethers.getContractFactory("Pyramid");
    pyramidInstance = await pyramidFactory.deploy();
    // SET REF PROGRAM
    const tx = pyramidInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
    await expect(tx)
      .to.emit(pyramidInstance, "ReferralProgram")
      .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

    // ERC20 Simple
    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    erc20Instance = await erc20Factory.deploy("ERC20Simple", "SMP", 1000000000);

    this.contractInstance = pyramidInstance;

    const hasRoleAdmin = await this.contractInstance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
    expect(hasRoleAdmin).to.equal(true);
    const hasRolePauser = await this.contractInstance.hasRole(PAUSER_ROLE, this.owner.address);
    expect(hasRolePauser).to.equal(true);

    // RULES
    stakePeriod = _stakePeriod; // stake time 60 sec
    stakePenalty = 0; // penalty???
    stakeCycles = 2;

    nativeDeposit = {
      tokenType: 0, // NATIVE
      token: constants.AddressZero,
      tokenId: 0,
      amount: 1000,
    };

    nativeReward = {
      tokenType: 0, // NATIVE
      token: constants.AddressZero,
      tokenId: 0,
      amount: 1000,
    };

    erc20Deposit = {
      tokenType: 1, // ERC20
      token: erc20Instance.address,
      tokenId: 0,
      amount: 100,
    };

    erc20Reward = {
      tokenType: 1, // ERC20
      token: erc20Instance.address,
      tokenId: 0,
      amount: 100,
    };
  });

  describe("setRule", function () {
    it("should fail edit when Rule not exist", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      const tx1 = pyramidInstance.updateRule(2, false);
      await expect(tx1).to.be.revertedWith("Pyramid: rule does not exist");
    });

    it("should set one Rule", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
    });

    it("should set multiple Rules", async function () {
      const stakeRule1: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 2,
        deposit: nativeDeposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // todo count Events?
    });

    it("should edit Rule", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      const tx1 = pyramidInstance.updateRule(1, false);
      await expect(tx1).to.emit(pyramidInstance, "RuleUpdated").withArgs(1, false);
    });
  });

  describe("Staking", function () {
    it("should fail for not existing rule", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      const tx1 = pyramidInstance.deposit(this.owner.address, 2, 0, { value: 100 });
      await expect(tx1).to.be.revertedWith("Pyramid: rule doesn't exist");
    });

    it("should fail for not active rule", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: false,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      const tx1 = pyramidInstance.deposit(this.owner.address, 1, 0, { value: 100 });
      await expect(tx1).to.be.revertedWith("Pyramid: rule doesn't active");
    });

    it("should fail for wrong pay amount", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      const tx1 = pyramidInstance.deposit(this.owner.address, 1, 0, { value: 100 });
      await expect(tx1).to.be.revertedWith("Pyramid: wrong amount");
    });

    it("should stake NATIVE", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      const tx1 = pyramidInstance.deposit(this.owner.address, 1, nativeDeposit.tokenId, {
        value: nativeDeposit.amount,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
    });

    it("should stake ERC20", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(pyramidInstance.address, erc20Deposit.amount);

      const tx1 = pyramidInstance.deposit(this.owner.address, 1, erc20Deposit.tokenId);
      await expect(tx1)
        .to.emit(pyramidInstance, "StakingStart")
        .to.emit(erc20Instance, "Transfer")
        .withArgs(this.owner.address, pyramidInstance.address, erc20Deposit.amount);
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
    });
  });

  describe("Reward", function () {
    it("should fail for wrong staking id", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      const tx1 = pyramidInstance
        .connect(this.receiver)
        .deposit(this.owner.address, 1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");

      const stakeBalance = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await pyramidInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = pyramidInstance.connect(this.receiver).receiveReward(2, true, true);
      await expect(tx2).to.be.revertedWith("Pyramid: wrong staking id");
    });

    it("should fail for not an owner", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      const tx1 = pyramidInstance
        .connect(this.receiver)
        .deposit(this.owner.address, 1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await pyramidInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = pyramidInstance.receiveReward(1, true, true);
      await expect(tx2).to.be.revertedWith("Pyramid: not an owner");
    });

    it("should fail for withdrawn already", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      const tx1 = pyramidInstance
        .connect(this.receiver)
        .deposit(this.owner.address, 1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await pyramidInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await pyramidInstance.connect(this.receiver).receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(pyramidInstance, "StakingWithdraw")
        .to.emit(pyramidInstance, "StakingFinish")
        .to.changeEtherBalance(this.receiver, nativeReward.amount * 2 + nativeReward.amount);

      const tx3 = pyramidInstance.connect(this.receiver).receiveReward(1, true, true);
      await expect(tx3).to.be.revertedWith("Pyramid: deposit withdrawn already");
    });

    it("should stake NATIVE & receive NATIVE", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      const tx1 = pyramidInstance.deposit(this.owner.address, 1, nativeDeposit.tokenId, {
        value: nativeDeposit.amount,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await pyramidInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await pyramidInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(pyramidInstance, "StakingWithdraw")
        .to.emit(pyramidInstance, "StakingFinish")
        .to.changeEtherBalance(this.owner, nativeReward.amount * stakeCycles + nativeReward.amount);
    });

    it("should stake NATIVE & receive ERC20", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      const tx1 = pyramidInstance.deposit(this.owner.address, 1, nativeDeposit.tokenId, {
        value: nativeDeposit.amount,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await erc20Instance.mint(pyramidInstance.address, erc20Reward.amount * stakeCycles);
      let balance = await erc20Instance.balanceOf(pyramidInstance.address);
      expect(balance).to.equal(erc20Reward.amount * stakeCycles);
      const tx2 = await pyramidInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(pyramidInstance, "StakingWithdraw")
        .to.emit(pyramidInstance, "StakingFinish")
        .to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Reward.amount * stakeCycles);
      // DEPOSIT
      await expect(tx2).to.changeEtherBalance(this.owner, nativeDeposit.amount);
    });

    it("should stake ERC20 & receive NATIVE", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: nativeReward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(pyramidInstance.address, erc20Deposit.amount);
      const tx1 = pyramidInstance.deposit(this.owner.address, 1, erc20Deposit.tokenId);
      await expect(tx1).to.emit(pyramidInstance, "StakingStart").to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await pyramidInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await pyramidInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(pyramidInstance, "StakingWithdraw")
        .to.emit(pyramidInstance, "StakingFinish")
        .to.changeEtherBalance(this.owner, nativeReward.amount * stakeCycles);
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
    });

    it("should stake ERC20 & receive ERC20", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(pyramidInstance.address, erc20Deposit.amount);
      const tx1 = pyramidInstance.deposit(this.owner.address, 1, erc20Deposit.tokenId);
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await erc20Instance.mint(pyramidInstance.address, erc20Reward.amount * stakeCycles);
      const tx2 = await pyramidInstance.receiveReward(1, true, true);
      await expect(tx2).to.emit(pyramidInstance, "StakingWithdraw");
      await expect(tx2).to.emit(pyramidInstance, "StakingFinish");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Reward.amount * stakeCycles + erc20Deposit.amount);
    });
  });

  describe("Finalize", function () {
    it("should fail send ETH", async function () {
      const tx = this.owner.sendTransaction({
        to: this.contractInstance.address,
        value: constants.WeiPerEther,
      });

      await expect(tx).to.be.reverted;
    });

    it("should fund ETH", async function () {
      const tx = this.contractInstance.fundEth({ value: constants.WeiPerEther });
      await expect(tx).to.changeEtherBalance(this.contractInstance, constants.WeiPerEther);
    });

    it("should finalize by selfdestruct", async function () {
      const tx = this.contractInstance.fundEth({ value: constants.WeiPerEther });
      await expect(tx).to.changeEtherBalance(this.contractInstance, constants.WeiPerEther);

      const tx1 = this.contractInstance.finalize();
      await expect(tx1).to.changeEtherBalance(this.owner, constants.WeiPerEther);
    });

    it("should finalize by Rule", async function () {
      const stakeRule1: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // STAKE 1
      const tx1 = pyramidInstance.deposit(this.owner.address, 1, nativeDeposit.tokenId, {
        value: nativeDeposit.amount,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);

      // STAKE 2
      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(pyramidInstance.address, erc20Deposit.amount);
      const tx2 = pyramidInstance.deposit(this.owner.address, 2, erc20Deposit.tokenId);
      await expect(tx2).to.emit(pyramidInstance, "StakingStart");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);

      // FINALIZE 1
      const tx3 = this.contractInstance.finalizeByRuleId(1);
      await expect(tx3).to.changeEtherBalance(this.owner, nativeDeposit.amount);

      // FINALIZE 2
      const tx4 = this.contractInstance.finalizeByRuleId(2);
      await expect(tx4).to.changeTokenBalance(erc20Instance, this.owner, erc20Deposit.amount);
    });

    it("should finalize by Token", async function () {
      const stakeRule1: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // STAKE 1
      const tx1 = pyramidInstance.deposit(this.owner.address, 1, nativeDeposit.tokenId, {
        value: nativeDeposit.amount,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);

      // STAKE 2
      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(pyramidInstance.address, erc20Deposit.amount);
      const tx2 = pyramidInstance.deposit(this.owner.address, 2, erc20Deposit.tokenId);
      await expect(tx2).to.emit(pyramidInstance, "StakingStart");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);

      // FINALIZE 1
      const tx3 = this.contractInstance.finalizeByToken(tokenZero);
      await expect(tx3).to.changeEtherBalance(this.owner, nativeDeposit.amount);

      // FINALIZE 2
      const tx4 = this.contractInstance.finalizeByToken(erc20Instance.address);
      await expect(tx4).to.changeTokenBalance(erc20Instance, this.owner, erc20Deposit.amount);
    });

    it("should fail finalize by Rule: 0 balance", async function () {
      const stakeRule1: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // FINALIZE 1
      const tx3 = this.contractInstance.finalizeByRuleId(1);
      await expect(tx3).to.be.revertedWith("Pyramid: 0 balance");

      // FINALIZE 2
      const tx4 = this.contractInstance.finalizeByRuleId(2);
      await expect(tx4).to.be.revertedWith("Pyramid: 0 balance");
    });

    it("should fail finalize by Token: 0 balance", async function () {
      const stakeRule1: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // FINALIZE 1
      const tx3 = this.contractInstance.finalizeByToken(tokenZero);
      await expect(tx3).to.be.revertedWith("Pyramid: 0 balance");

      // FINALIZE 2
      const tx4 = this.contractInstance.finalizeByToken(erc20Instance.address);
      await expect(tx4).to.be.revertedWith("Pyramid: 0 balance");
    });
  });

  describe("Withdraw", function () {
    it("should Withdraw", async function () {
      const stakeRule1: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // STAKE 1
      const tx1 = pyramidInstance.deposit(this.owner.address, 1, nativeDeposit.tokenId, {
        value: nativeDeposit.amount,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);

      // STAKE 2
      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(pyramidInstance.address, erc20Deposit.amount);
      const tx2 = pyramidInstance.deposit(this.owner.address, 2, erc20Deposit.tokenId);
      await expect(tx2).to.emit(pyramidInstance, "StakingStart");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);

      // WITHDRAW 1
      const tx3 = this.contractInstance.withdrawToken(tokenZero, nativeDeposit.amount / 2);
      await expect(tx3).to.changeEtherBalance(this.owner, nativeDeposit.amount / 2);

      // WITHDRAW 2
      const tx4 = this.contractInstance.withdrawToken(erc20Instance.address, erc20Deposit.amount / 2);
      await expect(tx4).to.changeTokenBalance(erc20Instance, this.owner, erc20Deposit.amount / 2);
    });

    it("should fail Withdraw: balance exceeded", async function () {
      const stakeRule1: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // STAKE 1
      const tx1 = pyramidInstance.deposit(this.owner.address, 1, nativeDeposit.tokenId, {
        value: nativeDeposit.amount,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);

      // STAKE 2
      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(pyramidInstance.address, erc20Deposit.amount);
      const tx2 = pyramidInstance.deposit(this.owner.address, 2, erc20Deposit.tokenId);
      await expect(tx2).to.emit(pyramidInstance, "StakingStart");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);

      // WITHDRAW 1
      const tx3 = this.contractInstance.withdrawToken(tokenZero, nativeDeposit.amount * 2);
      await expect(tx3).to.be.revertedWith("Pyramid: balance exceeded");

      // WITHDRAW 2
      const tx4 = this.contractInstance.withdrawToken(erc20Instance.address, erc20Deposit.amount * 2);
      await expect(tx4).to.be.revertedWith("Pyramid: balance exceeded");
    });
  });

  describe("Referral", function () {
    it("should Deposit with Reward (multi ref)", async function () {
      const stakeRule1 = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: constants.WeiPerEther,
        },
        reward: nativeReward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2 = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // STAKE 1-1
      const tx11 = pyramidInstance.connect(this.owner).deposit(this.receiver.address, 1, stakeRule1.deposit.tokenId, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx11).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance1 = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance1).to.equal(stakeRule1.deposit.amount);
      await expect(tx11)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          this.owner.address,
          this.receiver.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      // STAKE 1-2
      const tx12 = pyramidInstance.connect(this.stranger).deposit(this.owner.address, 1, stakeRule1.deposit.tokenId, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx12).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance2 = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance2).to.equal(stakeRule1.deposit.amount.mul(2));
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          this.stranger.address,
          this.owner.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          this.stranger.address,
          this.receiver.address,
          1,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        );

      // STAKE 1-3
      const tx13 = pyramidInstance
        .connect(this.receiver)
        .deposit(this.stranger.address, 1, stakeRule1.deposit.tokenId, {
          value: stakeRule1.deposit.amount,
        });
      await expect(tx13).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance3 = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance3).to.equal(stakeRule1.deposit.amount.mul(3));
      await expect(tx13)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          this.receiver.address,
          this.stranger.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );
      await expect(tx13)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          this.receiver.address,
          this.owner.address,
          1,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        );

      // WITHDRAW REF REWARD 1
      const refBalance0 = await pyramidInstance.connect(this.receiver).getBalance(this.receiver.address, tokenZero);
      expect(refBalance0).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0)
          .add(
            constants.WeiPerEther.div(100)
              .mul((refProgram.refReward / 100) | 0)
              .div(refProgram.refDecrease ** 1),
          ),
      );
      const tx2 = pyramidInstance.connect(this.receiver).withdrawReward(tokenZero);
      await expect(tx2)
        .to.emit(pyramidInstance, "ReferralWithdraw")
        .withArgs(this.receiver.address, tokenZero, refBalance0);
      await expect(tx2).to.changeEtherBalance(this.receiver, refBalance0);

      // WITHDRAW REF REWARD 2
      const refBalance1 = await pyramidInstance.connect(this.owner).getBalance(this.owner.address, tokenZero);
      expect(refBalance1).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0)
          .add(
            constants.WeiPerEther.div(100)
              .mul((refProgram.refReward / 100) | 0)
              .div(refProgram.refDecrease ** 1),
          ),
      );
      const tx21 = pyramidInstance.connect(this.owner).withdrawReward(tokenZero);
      await expect(tx21)
        .to.emit(pyramidInstance, "ReferralWithdraw")
        .withArgs(this.owner.address, tokenZero, refBalance1);
      await expect(tx21).to.changeEtherBalance(this.owner, refBalance1);

      // WITHDRAW REF REWARD 3
      const refBalance2 = await pyramidInstance.connect(this.owner).getBalance(this.stranger.address, tokenZero);
      expect(refBalance2).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
      const tx22 = pyramidInstance.connect(this.stranger).withdrawReward(tokenZero);
      await expect(tx22)
        .to.emit(pyramidInstance, "ReferralWithdraw")
        .withArgs(this.stranger.address, tokenZero, refBalance2);
      await expect(tx22).to.changeEtherBalance(this.stranger, refBalance2);
    });

    it("should Deposit with Auto Reward (multi ref)", async function () {
      const stakeRule1 = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: constants.WeiPerEther,
        },
        reward: nativeReward,
        content: [],
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };
      const stakeRule2 = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc20Reward,
        content: [],
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const refReward0 = constants.WeiPerEther.div(100) // level 0
        .mul((refProgram.refReward / 100) | 0)
        .div(refProgram.refDecrease ** 0);

      const refReward1 = constants.WeiPerEther.div(100) // level 1
        .mul((refProgram.refReward / 100) | 0)
        .div(refProgram.refDecrease ** 1);

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // SET AUTO REWARD
      await pyramidInstance.setAutoWithdrawal(true);

      // STAKE 1-1
      const tx11 = pyramidInstance.connect(this.owner).deposit(this.receiver.address, 1, stakeRule1.deposit.tokenId, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx11).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance1 = await this.provider.getBalance(pyramidInstance.address);

      expect(stakeBalance1).to.equal(stakeRule1.deposit.amount.sub(refReward0));
      await expect(tx11)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(this.owner.address, this.receiver.address, 0, tokenZero, refReward0);
      await expect(tx11)
        .to.emit(pyramidInstance, "ReferralWithdraw")
        .withArgs(this.receiver.address, tokenZero, refReward0);
      await expect(tx11).to.changeEtherBalance(this.receiver, refReward0);

      // STAKE 1-2
      const tx12 = pyramidInstance.connect(this.stranger).deposit(this.owner.address, 1, stakeRule1.deposit.tokenId, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx12).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance2 = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance2).to.equal(stakeRule1.deposit.amount.mul(2).sub(refReward0.mul(2)));
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(this.stranger.address, this.owner.address, 0, tokenZero, refReward0);
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(this.stranger.address, this.receiver.address, 1, tokenZero, refReward1);
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralWithdraw")
        .withArgs(this.owner.address, tokenZero, refReward0);
      await expect(tx12).to.changeEtherBalance(this.owner, refReward0);

      // STAKE 1-3
      const tx13 = pyramidInstance
        .connect(this.receiver)
        .deposit(this.stranger.address, 1, stakeRule1.deposit.tokenId, {
          value: stakeRule1.deposit.amount,
        });
      await expect(tx13).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance3 = await this.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance3).to.equal(stakeRule1.deposit.amount.mul(3).sub(refReward0.mul(3)));
      await expect(tx13)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(this.receiver.address, this.stranger.address, 0, tokenZero, refReward0);
      await expect(tx13)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(this.receiver.address, this.owner.address, 1, tokenZero, refReward1);
      await expect(tx13)
        .to.emit(pyramidInstance, "ReferralWithdraw")
        .withArgs(this.stranger.address, tokenZero, refReward0);
      await expect(tx13).to.changeEtherBalance(this.stranger, refReward0);

      // WITHDRAW REF REWARD 1
      const refBalance0 = await pyramidInstance.connect(this.receiver).getBalance(this.receiver.address, tokenZero);
      expect(refBalance0).to.equal(refReward1);
      const tx2 = pyramidInstance.connect(this.receiver).withdrawReward(tokenZero);
      await expect(tx2)
        .to.emit(pyramidInstance, "ReferralWithdraw")
        .withArgs(this.receiver.address, tokenZero, refBalance0);
      await expect(tx2).to.changeEtherBalance(this.receiver, refBalance0);

      // WITHDRAW REF REWARD 2
      const refBalance1 = await pyramidInstance.connect(this.owner).getBalance(this.owner.address, tokenZero);
      expect(refBalance1).to.equal(refReward1);
      const tx21 = pyramidInstance.connect(this.owner).withdrawReward(tokenZero);
      await expect(tx21)
        .to.emit(pyramidInstance, "ReferralWithdraw")
        .withArgs(this.owner.address, tokenZero, refBalance1);
      await expect(tx21).to.changeEtherBalance(this.owner, refBalance1);

      // WITHDRAW REF REWARD 3
      const refBalance2 = await pyramidInstance.connect(this.owner).getBalance(this.stranger.address, tokenZero);
      expect(refBalance2).to.equal(0);
      const tx22 = pyramidInstance.connect(this.stranger).withdrawReward(tokenZero);
      await expect(tx22).to.be.revertedWith("Referral: Zero balance");
    });
  });
});

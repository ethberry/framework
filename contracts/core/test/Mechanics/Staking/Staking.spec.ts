import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers, waffle, web3, network } from "hardhat";
import { BigNumber, constants, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import {
  ERC1155Simple,
  ERC20Simple,
  ERC721MysteryboxSimple,
  ERC721RandomHardhat,
  ERC721Simple,
  LinkErc20,
  Staking,
  VRFCoordinatorMock,
} from "../../../typechain-types";
import {
  _stakePeriod,
  baseTokenURI,
  decimals,
  DEFAULT_ADMIN_ROLE,
  LINK_ADDR,
  MINTER_ROLE,
  PAUSER_ROLE,
  royalty,
  templateId,
  tokenId,
  VRF_ADDR,
} from "../../constants";
import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { IAsset, IRule } from "./interface/staking";
import { randomRequest } from "../../shared/randomRequest";
import { deployLinkVrfFixture } from "../../shared/link";

use(solidity);

describe("Staking", function () {
  let stakingInstance: Staking;
  let erc721RandomInstance: ERC721RandomHardhat;
  let mysteryboxInstance: ERC721MysteryboxSimple;
  let erc721SimpleInstance: ERC721Simple;
  let erc20Instance: ERC20Simple;
  let erc1155Instance: ERC1155Simple;
  let stakePeriod: number;
  let stakePenalty: number;
  let stakeCycles: number;
  let nativeDeposit: IAsset;
  let nativeReward: IAsset;
  let erc20Deposit: IAsset;
  let erc20Reward: IAsset;
  let erc721RewardRnd: IAsset;
  let erc721RewardDbx: IAsset;
  let erc721RewardSmpl: IAsset;
  let erc721Deposit: IAsset;
  let erc1155Reward: IAsset;
  let erc1155Deposit: IAsset;
  const templateKey = "0x9319bf1fd23873eaf43c06bb91a1db3e678411d693e959f1512879196908f12c";
  this.timeout(142000);

  let linkInstance: LinkErc20;
  let vrfInstance: VRFCoordinatorMock;

  before(async function () {
    await network.provider.send("hardhat_reset");

    // https://github.com/NomicFoundation/hardhat/issues/2980
    ({ linkInstance, vrfInstance } = await loadFixture(function staking() {
      return deployLinkVrfFixture();
    }));

    expect(linkInstance.address).equal(LINK_ADDR);
    expect(vrfInstance.address).equal(VRF_ADDR);
  });

  after(async function () {
    await network.provider.send("hardhat_reset");
  });

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();
    this.provider = waffle.provider;

    // Staking
    const stakingFactory = await ethers.getContractFactory("Staking");
    stakingInstance = await stakingFactory.deploy(1);

    // ERC20 Simple
    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    erc20Instance = await erc20Factory.deploy("ERC20Simple", "SMP", 1000000000);

    // ERC721 Simple
    const simple721Factory = await ethers.getContractFactory("ERC721Simple");
    erc721SimpleInstance = await simple721Factory.deploy("ERC721Simple", "SMP", royalty, baseTokenURI);

    // ERC721 Random
    const erc721randomFactory = await ethers.getContractFactory("ERC721RandomHardhat");
    erc721RandomInstance = await erc721randomFactory.deploy("ERC721Random", "RND", royalty, baseTokenURI);

    // ERC721 Mysterybox
    const mysteryboxFactory = await ethers.getContractFactory("ERC721MysteryboxSimple");
    mysteryboxInstance = await mysteryboxFactory.deploy("ERC721MysteryboxSimple", "LOOT", royalty, baseTokenURI);

    // ERC1155
    const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
    erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);

    // Grant roles
    await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
    await erc721RandomInstance.grantRole(MINTER_ROLE, stakingInstance.address);
    await mysteryboxInstance.grantRole(MINTER_ROLE, stakingInstance.address);
    await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);
    await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

    // Fund LINK to erc721Random contract
    await linkInstance.transfer(erc721RandomInstance.address, BigNumber.from("1000").mul(decimals));

    this.contractInstance = stakingInstance;

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

    erc721Deposit = {
      tokenType: 2, // ERC721
      token: erc721RandomInstance.address,
      tokenId: 1,
      amount: 0,
    };

    erc721RewardSmpl = {
      tokenType: 2, // ERC721
      token: erc721SimpleInstance.address,
      tokenId: 1,
      amount: 0,
    };

    erc721RewardRnd = {
      tokenType: 2, // ERC721
      token: erc721RandomInstance.address,
      tokenId: 1,
      amount: 0,
    };

    erc721RewardDbx = {
      tokenType: 2, // ERC721
      token: mysteryboxInstance.address,
      tokenId: 1,
      amount: 0,
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

    erc1155Deposit = {
      tokenType: 4, // ERC1155
      token: erc1155Instance.address,
      tokenId: 1,
      amount: 100,
    };

    erc1155Reward = {
      tokenType: 4, // ERC1155
      token: erc1155Instance.address,
      tokenId: 1,
      amount: 100,
    };
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("setRule", function () {
    it("should fail for wrong role", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.connect(this.receiver).setRules([stakeRule]);

      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should fail edit when Rule not exist", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.updateRule(2, false);
      await expect(tx1).to.be.revertedWith("Staking: rule does not exist");
    });

    it("should set one Rule", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
    });

    it("should set multiple Rules", async function () {
      const stakeRule1: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 2,
        deposit: nativeDeposit,
        reward: erc721RewardDbx,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };
      const tx = stakingInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // todo count Events?
    });

    it("should edit Rule", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.updateRule(1, false);
      await expect(tx1).to.emit(stakingInstance, "RuleUpdated").withArgs(1, false);
    });
  });

  describe("Staking", function () {
    it("should fail for not existing rule", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(2, erc721RewardRnd.tokenId, { value: 100 });
      await expect(tx1).to.be.revertedWith("Staking: rule doesn't exist");
    });

    it("should fail for not active rule", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: false,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(1, erc721RewardRnd.tokenId, { value: 100 });
      await expect(tx1).to.be.revertedWith("Staking: rule doesn't active");
    });

    it("should fail for wrong pay amount", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(1, erc721RewardRnd.tokenId, { value: 100 });
      await expect(tx1).to.be.revertedWith("Staking: wrong amount");
    });

    it("should fail for limit exceed", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      await stakingInstance.setMaxStake(0);

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(1, erc721RewardRnd.tokenId, { value: 100 });
      await expect(tx1).to.be.revertedWith("Staking: stake limit exceeded");
    });

    it("should stake NATIVE", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
    });

    it("should stake ERC20", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc20Reward,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(stakingInstance.address, erc20Deposit.amount);

      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenId);
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .to.emit(erc20Instance, "Transfer")
        .withArgs(this.owner.address, stakingInstance.address, erc20Deposit.amount);
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
    });

    it("should stake ERC721", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc721Deposit,
        reward: erc20Reward,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      await erc721RandomInstance.mintCommon(this.owner.address, templateId);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, tokenId);

      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenId);
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .to.emit(erc721RandomInstance, "Transfer")
        .withArgs(this.owner.address, stakingInstance.address, tokenId);
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
    });

    it("should stake ERC1155", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc1155Deposit,
        reward: erc20Reward,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      await erc1155Instance.mint(this.owner.address, tokenId, erc1155Deposit.amount, "0x");
      let balance = await erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balance).to.equal(erc1155Deposit.amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenId);
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(
          stakingInstance.address,
          this.owner.address,
          stakingInstance.address,
          erc1155Deposit.tokenId,
          erc1155Deposit.amount,
        );
      balance = await erc1155Instance.balanceOf(this.owner.address, tokenId);
      expect(balance).to.equal(0);
    });
  });

  describe("Reward", function () {
    it("should fail for wrong staking id", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance
        .connect(this.receiver)
        .deposit(1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");

      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = stakingInstance.connect(this.receiver).receiveReward(2, true, true);
      await expect(tx2).to.be.revertedWith("Staking: wrong staking id");
    });

    it("should fail for not an owner", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance
        .connect(this.receiver)
        .deposit(1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = stakingInstance.receiveReward(1, true, true);
      await expect(tx2).to.be.revertedWith("Staking: not an owner");
    });

    it("should fail for withdrawn already", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance
        .connect(this.receiver)
        .deposit(1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await stakingInstance.connect(this.receiver).receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.changeEtherBalance(this.receiver, nativeReward.amount * 2 + nativeReward.amount);

      const tx3 = stakingInstance.connect(this.receiver).receiveReward(1, true, true);
      await expect(tx3).to.be.revertedWith("Staking: deposit withdrawn already");
    });

    it("should fail deposit for wrong tokenId", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc721Deposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(this.owner.address, templateId);
      await erc721RandomInstance.mintCommon(this.owner.address, templateId + 1);
      const balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(2);
      expect(await erc721RandomInstance.getRecordFieldValue(erc721Deposit.tokenId, templateKey)).to.equal(templateId);
      expect(await erc721RandomInstance.getRecordFieldValue(erc721Deposit.tokenId + 1, templateKey)).to.equal(
        templateId + 1,
      );
      // APPROVE
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      await erc721RandomInstance.approve(stakingInstance.address, 2);
      // DEPOSIT
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenId + 1);
      await expect(tx1).to.be.revertedWith("Staking: wrong deposit token templateID");
    });

    it("should stake NATIVE & receive NATIVE", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: nativeReward,
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.changeEtherBalance(this.owner, nativeReward.amount * stakeCycles + nativeReward.amount);
    });

    it("should stake NATIVE & receive ERC20", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc20Reward,
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await erc20Instance.mint(stakingInstance.address, erc20Reward.amount * stakeCycles);
      let balance = await erc20Instance.balanceOf(stakingInstance.address);
      expect(balance).to.equal(erc20Reward.amount * stakeCycles);
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Reward.amount * stakeCycles);
      // DEPOSIT
      await expect(tx2).to.changeEtherBalance(this.owner, nativeDeposit.amount);
    });

    it("should stake NATIVE & receive ERC721 Random", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.emit(erc721RandomInstance, "RandomRequest")
        .to.emit(linkInstance, "Transfer");
      // RANDOM
      await randomRequest(erc721RandomInstance, vrfInstance);
      const balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(2);
      // DEPOSIT
      await expect(tx2).to.changeEtherBalance(this.owner, nativeDeposit.amount);
    });

    it("should stake NATIVE & receive ERC721 Common", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardSmpl,
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.emit(erc721SimpleInstance, "Transfer");
      const balance = await erc721SimpleInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      await expect(tx2).to.changeEtherBalance(this.owner, nativeDeposit.amount);
    });

    it("should stake NATIVE & receive ERC721 Mysterybox", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc721RewardDbx,
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.emit(mysteryboxInstance, "Transfer");
      const balance = await mysteryboxInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      await expect(tx2).to.changeEtherBalance(this.owner, nativeDeposit.amount);
    });

    it("should stake NATIVE & receive ERC1155", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: nativeDeposit,
        reward: erc1155Reward,
        period: stakePeriod, // 60 sec
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenId, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.emit(erc1155Instance, "TransferSingle");
      const balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenId);
      expect(balance).to.equal(erc20Reward.amount * stakeCycles);
      await expect(tx2).to.changeEtherBalance(this.owner, nativeDeposit.amount);
    });

    it("should stake ERC20 & receive NATIVE", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: nativeReward,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(stakingInstance.address, erc20Deposit.amount);
      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart").to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.changeEtherBalance(this.owner, nativeReward.amount * stakeCycles);
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
    });

    it("should stake ERC20 & receive ERC20", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc20Reward,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(stakingInstance.address, erc20Deposit.amount);
      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await erc20Instance.mint(stakingInstance.address, erc20Reward.amount * stakeCycles);
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Reward.amount * stakeCycles + erc20Deposit.amount);
    });

    it("should stake ERC20 & receive ERC721 Random", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(stakingInstance.address, erc20Deposit.amount);
      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721RandomInstance, "RandomRequest");
      await expect(tx2).to.emit(linkInstance, "Transfer");
      // RANDOM
      await randomRequest(erc721RandomInstance, vrfInstance);
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
    });

    it("should stake ERC20 & receive ERC721 Common", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc721RewardSmpl,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(stakingInstance.address, erc20Deposit.amount);
      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721SimpleInstance, "Transfer");
      balance = await erc721SimpleInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
    });

    it("should stake ERC20 & receive ERC721 Mysterybox", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc721RewardDbx,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(stakingInstance.address, erc20Deposit.amount);
      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(mysteryboxInstance, "Transfer");
      balance = await mysteryboxInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
    });

    it("should stake ERC20 & receive ERC1155", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc20Deposit,
        reward: erc1155Reward,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(stakingInstance.address, erc20Deposit.amount);
      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");

      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenId);
      expect(balance).to.equal(erc1155Reward.amount * stakeCycles);
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
    });

    it("should stake ERC721 & receive NATIVE", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc721Deposit,
        reward: nativeReward,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(this.owner.address, templateId);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.changeEtherBalance(this.owner, nativeReward.amount * stakeCycles);
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should stake ERC721 & receive ERC20", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc721Deposit,
        reward: erc20Reward,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(this.owner.address, templateId);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await erc20Instance.mint(stakingInstance.address, erc20Reward.amount * stakeCycles);
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw").to.emit(stakingInstance, "StakingFinish");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Reward.amount * stakeCycles);
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should stake ERC721 & receive ERC721 Random", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc721Deposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(this.owner.address, templateId);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart").to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.emit(erc721RandomInstance, "RandomRequest")
        .to.emit(linkInstance, "Transfer");
      // RANDOM
      await randomRequest(erc721RandomInstance, vrfInstance);
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(3);
    });

    it("should stake ERC721 & receive ERC721 Common", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc721Deposit,
        reward: erc721RewardSmpl,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(this.owner.address, templateId);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart").to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.emit(erc721SimpleInstance, "Transfer");
      balance = await erc721SimpleInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should stake ERC721 & receive ERC721 Mysterybox", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc721Deposit,
        reward: erc721RewardDbx,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(this.owner.address, templateId);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart").to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.emit(mysteryboxInstance, "Transfer");
      balance = await mysteryboxInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should stake ERC721 & receive ERC1155", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc721Deposit,
        reward: erc1155Reward,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.mintCommon(this.owner.address, templateId);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart").to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenId);
      expect(balance).to.equal(erc1155Reward.amount * stakeCycles);
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should stake ERC1155 & receive NATIVE", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc1155Deposit,
        reward: nativeReward,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc1155Instance.mint(this.owner.address, 1, erc1155Deposit.amount, "0x");
      let balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(erc1155Deposit.amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);
      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart").to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.changeEtherBalance(this.owner, nativeReward.amount * stakeCycles);
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenId);
      expect(balance).to.equal(erc1155Deposit.amount);
    });

    it("should stake ERC1155 & receive ERC20", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc1155Deposit,
        reward: erc20Reward,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc1155Instance.mint(this.owner.address, 1, erc1155Deposit.amount, "0x");
      let balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(erc1155Deposit.amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);
      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart").to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await erc20Instance.mint(stakingInstance.address, erc20Reward.amount * stakeCycles);
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw").to.emit(stakingInstance, "StakingFinish");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Reward.amount * stakeCycles);
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenId);
      expect(balance).to.equal(erc1155Deposit.amount);
    });

    it("should stake ERC1155 & receive ERC721 Random", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc1155Deposit,
        reward: erc721RewardRnd,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc1155Instance.mint(this.owner.address, 1, erc1155Deposit.amount, "0x");
      let balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(erc1155Deposit.amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);
      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart").to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721RandomInstance, "RandomRequest");
      await expect(tx2).to.emit(linkInstance, "Transfer");
      // RANDOM
      await randomRequest(erc721RandomInstance, vrfInstance);
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(2);
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenId);
      expect(balance).to.equal(erc1155Deposit.amount);
    });

    it("should stake ERC1155 & receive ERC721 Common", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc1155Deposit,
        reward: erc721RewardSmpl,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc1155Instance.mint(this.owner.address, 1, erc1155Deposit.amount, "0x");
      let balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(erc1155Deposit.amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);
      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.emit(erc721SimpleInstance, "Transfer");
      balance = await erc721SimpleInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenId);
      expect(balance).to.equal(erc1155Deposit.amount);
    });

    it("should stake ERC1155 & receive ERC721 Mysterybox", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc1155Deposit,
        reward: erc721RewardDbx,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc1155Instance.mint(this.owner.address, 1, erc1155Deposit.amount, "0x");
      let balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(erc1155Deposit.amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);
      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart").to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.emit(mysteryboxInstance, "Transfer");
      balance = await mysteryboxInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenId);
      expect(balance).to.equal(erc1155Deposit.amount);
    });

    it("should stake ERC1155 & receive ERC1155", async function () {
      const stakeRule: IRule = {
        externalId: 1,
        deposit: erc1155Deposit,
        reward: erc1155Reward,
        period: stakePeriod,
        penalty: stakePenalty,
        recurrent: false,
        active: true,
      };
      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc1155Instance.mint(this.owner.address, 1, erc1155Deposit.amount, "0x");
      let balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(erc1155Deposit.amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);
      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenId);
      await expect(tx1).to.emit(stakingInstance, "StakingStart").to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .to.emit(stakingInstance, "StakingFinish")
        .to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenId);
      expect(balance).to.equal(erc1155Reward.amount * stakeCycles + erc1155Reward.amount);
    });
  });

  // todo test recurrent
});

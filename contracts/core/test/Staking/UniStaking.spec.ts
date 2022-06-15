import { expect } from "chai";
import { ethers, waffle, web3 } from "hardhat";
import { BigNumber } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import {
  UniStaking,
  ERC721Simple,
  ERC721Random,
  ERC721RandomTest,
  ERC721Dropbox,
  ERC20Simple,
  ERC1155Simple,
  LinkErc20,
  VRFCoordinatorMock,
} from "../../typechain-types";
import {
  DEFAULT_ADMIN_ROLE,
  PAUSER_ROLE,
  _stakePeriod,
  MINTER_ROLE,
  decimals,
  tokenName,
  tokenSymbol,
  LINK_ADDR,
  VRF_ADDR,
} from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { IRule, IItem } from "./interface/staking";
import { randomRequest } from "../shared/accessControl/randomRequest";

describe("UniStaking", function () {
  let stakingInstance: UniStaking;
  let erc721RandomInstance: ERC721RandomTest;
  let erc721DropboxInstance: ERC721Dropbox;
  let erc721SimpleInstance: ERC721Simple;
  let erc20Instance: ERC20Simple;
  let erc1155Instance: ERC1155Simple;
  let stakePeriod: number;
  let stakePenalty: number;
  let stakeCycles: number;
  let nativeDeposit: IItem;
  let nativeReward: IItem;
  let erc20Deposit: IItem;
  let erc20Reward: IItem;
  let erc721RewardRnd: IItem;
  let erc721RewardDbx: IItem;
  let erc721RewardSmpl: IItem;
  let erc721Deposit: IItem;
  let erc1155Reward: IItem;
  let erc1155Deposit: IItem;
  this.timeout(142000);

  let linkInstance: LinkErc20;
  let vrfInstance: VRFCoordinatorMock;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();
    this.provider = waffle.provider;

    // UniStaking
    const stakingFactory = await ethers.getContractFactory("UniStaking");
    stakingInstance = await stakingFactory.deploy();
    // ERC20 Simple
    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    erc20Instance = await erc20Factory.deploy("ERC20Simple", "SMP", 1000000000);
    // ERC721 Simple
    const simple721Factory = await ethers.getContractFactory("ERC721Simple");
    erc721SimpleInstance = await simple721Factory.deploy("ERC721Simple", "SMP", "https://localhost", 100);
    // ERC721 Random
    const erc721randomFactory = await ethers.getContractFactory("ERC721RandomTest");
    erc721RandomInstance = await erc721randomFactory.deploy("ERC721Random", "RND", "https://localhost", 100);
    // ERC721 Dropbox
    const dropboxFactory = await ethers.getContractFactory("ERC721Dropbox");
    erc721DropboxInstance = await dropboxFactory.deploy("ERC721Dropbox", "DBX", "https://localhost", 100);
    // ERC1155
    const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
    erc1155Instance = await erc1155Factory.deploy("https://localhost");

    // Set max templates
    await erc721RandomInstance.setMaxTemplateId(2);

    // Deploy Chainlink & Vrf contracts
    const link = await ethers.getContractFactory("LinkErc20");
    linkInstance = await link.deploy(tokenName, tokenSymbol);
    console.info(`LINK_ADDR=${linkInstance.address.toLowerCase()}`);
    const linkAmountInWei = BigNumber.from("100000").mul(decimals);
    await linkInstance.mint(this.owner.address, linkAmountInWei);
    const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
    vrfInstance = await vrfFactory.deploy(linkInstance.address);
    console.info(`VRF_ADDR=${vrfInstance.address.toLowerCase()}`);
    if (
      linkInstance.address.toLowerCase() !== LINK_ADDR.toLowerCase() ||
      vrfInstance.address.toLowerCase() !== VRF_ADDR.toLowerCase()
    ) {
      console.info(`please change LINK_ADDR or VRF_ADDR in ERC721ChainLinkHH`);
      return;
    }

    // Grant roles
    await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
    await erc721RandomInstance.grantRole(MINTER_ROLE, stakingInstance.address);
    await erc721DropboxInstance.grantRole(MINTER_ROLE, stakingInstance.address);
    await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);
    await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

    // Fund LINK to erc721Random contract
    await linkInstance.transfer(erc721RandomInstance.address, ethers.BigNumber.from("1000").mul(decimals));

    this.contractInstance = stakingInstance;

    // RULES
    stakePeriod = _stakePeriod; // stake time 60 sec
    stakePenalty = 0; // penalty???
    stakeCycles = 2;

    nativeDeposit = {
      itemType: BigNumber.from(0), // NATIVE
      token: "0x0000000000000000000000000000000000000000",
      tokenData: { tokenId: BigNumber.from(0), templateId: BigNumber.from(0) },
      amount: BigNumber.from(1000),
    };

    nativeReward = {
      itemType: BigNumber.from(0), // NATIVE
      token: "0x0000000000000000000000000000000000000000",
      tokenData: { tokenId: BigNumber.from(0), templateId: BigNumber.from(0) },
      amount: BigNumber.from(1000),
    };

    erc721Deposit = {
      itemType: BigNumber.from(2), // ERC721
      token: erc721RandomInstance.address,
      tokenData: { tokenId: BigNumber.from(1), templateId: BigNumber.from(0) },
      amount: BigNumber.from(0),
    };

    erc721RewardSmpl = {
      itemType: BigNumber.from(2), // ERC721
      token: erc721SimpleInstance.address,
      tokenData: { tokenId: BigNumber.from(0), templateId: BigNumber.from(1) },
      amount: BigNumber.from(0),
    };

    erc721RewardRnd = {
      itemType: BigNumber.from(2), // ERC721
      token: erc721RandomInstance.address,
      tokenData: { tokenId: BigNumber.from(0), templateId: BigNumber.from(1) },
      amount: BigNumber.from(0),
    };

    erc721RewardDbx = {
      itemType: BigNumber.from(2), // ERC721
      token: erc721DropboxInstance.address,
      tokenData: { tokenId: BigNumber.from(0), templateId: BigNumber.from(1) },
      amount: BigNumber.from(0),
    };

    erc20Deposit = {
      itemType: BigNumber.from(1), // ERC20
      token: erc20Instance.address,
      tokenData: { tokenId: BigNumber.from(0), templateId: BigNumber.from(0) },
      amount: BigNumber.from(100),
    };

    erc20Reward = {
      itemType: BigNumber.from(1), // ERC20
      token: erc20Instance.address,
      tokenData: { tokenId: BigNumber.from(0), templateId: BigNumber.from(0) },
      amount: BigNumber.from(100),
    };

    erc1155Deposit = {
      itemType: BigNumber.from(3), // ERC1155
      token: erc1155Instance.address,
      tokenData: { tokenId: BigNumber.from(1), templateId: BigNumber.from(0) },
      amount: BigNumber.from(100),
    };

    erc1155Reward = {
      itemType: BigNumber.from(3), // ERC1155
      token: erc1155Instance.address,
      tokenData: { tokenId: BigNumber.from(1), templateId: BigNumber.from(0) },
      amount: BigNumber.from(100),
    };
  });

  // beforeAll(async function () {
  //   const [owner] = await ethers.getSigners();
  //
  //   // Deploy Chainlink & Vrf contracts
  //   const link = await ethers.getContractFactory("LinkErc20");
  //   linkInstance = await link.deploy(tokenName, tokenSymbol);
  //   console.info(`LINK_ADDR=${linkInstance.address.toLowerCase()}`);
  //   const linkAmountInWei = BigNumber.from("100000").mul(decimals);
  //   await linkInstance.mint(owner.address, linkAmountInWei);
  //   const vrfFactory = await ethers.getContractFactory("VRFCoordinatorMock");
  //   vrfInstance = await vrfFactory.deploy(linkInstance.address);
  //   console.info(`VRF_ADDR=${vrfInstance.address.toLowerCase()}`);
  //   if (
  //     linkInstance.address.toLowerCase() !== LINK_ADDR.toLowerCase() ||
  //     vrfInstance.address.toLowerCase() !== VRF_ADDR.toLowerCase()
  //   ) {
  //     console.info(`please change LINK_ADDR or VRF_ADDR in ERC721ChainLinkHH`);
  //   }
  // });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("setRule", function () {
    it("should fail for wrong role", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.connect(this.receiver).setRules([stakeRule]);

      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${this.receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`,
      );
    });

    it("should set one Rule", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
    });

    it("should set multiple Rules", async function () {
      const stakeRule1: IRule = {
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        deposit: nativeDeposit,
        reward: erc721RewardDbx,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };
      const tx = stakingInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // todo count Events?
    });
  });

  describe("Staking", function () {
    it("should fail for not existing rule", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(2, erc721RewardRnd.tokenData, { value: BigNumber.from(100) });
      await expect(tx1).to.be.revertedWith(`Staking: rule doesn't exist'`);
    });

    it("should fail for not active rule", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: false,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(1, erc721RewardRnd.tokenData, { value: BigNumber.from(100) });
      await expect(tx1).to.be.revertedWith(`Staking: rule doesn't active'`);
    });

    it("should fail for wrong pay amount", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(1, erc721RewardRnd.tokenData, { value: BigNumber.from(100) });
      await expect(tx1).to.be.revertedWith(`Staking: wrong amount'`);
    });

    it("should stake NATIVE", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenData, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
    });

    it("should stake ERC20", async function () {
      const stakeRule: IRule = {
        deposit: erc20Deposit,
        reward: erc20Reward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      await erc20Instance.mint(this.owner.address, erc20Deposit.amount);
      let balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
      await erc20Instance.approve(stakingInstance.address, erc20Deposit.amount);

      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
    });

    it("should stake ERC721", async function () {
      const stakeRule: IRule = {
        deposit: erc721Deposit,
        reward: erc20Reward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      await erc721RandomInstance.setMaxTemplateId(2);
      await erc721RandomInstance.mintCommon(this.owner.address, 1);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);

      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
    });

    it("should stake ERC1155", async function () {
      const stakeRule: IRule = {
        deposit: erc1155Deposit,
        reward: erc20Reward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      await erc1155Instance.mint(this.owner.address, 1, erc1155Deposit.amount, "0x");
      let balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(erc1155Deposit.amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
    });
  });

  describe("Reward", function () {
    it("should fail for wrong staking id", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: nativeReward,
        period: BigNumber.from(stakePeriod), // 60 sec
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance
        .connect(this.receiver)
        .deposit(1, nativeDeposit.tokenData, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");

      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: ethers.utils.parseEther("1.0") });
      const tx2 = stakingInstance.connect(this.receiver).receiveReward(1, true, true);
      await expect(tx2).to.be.revertedWith(`Staking: wrong staking id`);
    });

    it("should fail for not an owner", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: nativeReward,
        period: BigNumber.from(stakePeriod), // 60 sec
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance
        .connect(this.receiver)
        .deposit(1, nativeDeposit.tokenData, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: ethers.utils.parseEther("1.0") });
      const tx2 = stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.be.revertedWith(`Staking: not an owner`);
    });

    it("should fail for withdrawn already", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: nativeReward,
        period: BigNumber.from(stakePeriod), // 60 sec
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance
        .connect(this.receiver)
        .deposit(1, nativeDeposit.tokenData, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: ethers.utils.parseEther("1.0") });
      const tx2 = await stakingInstance.connect(this.receiver).receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.changeEtherBalance(this.receiver, nativeReward.amount.mul(2).add(nativeReward.amount));

      const tx3 = stakingInstance.connect(this.receiver).receiveReward(0, true, true);
      await expect(tx3).to.be.revertedWith(`Staking: deposit withdrawn already`);
    });

    it("should stake NATIVE & receive NATIVE", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: nativeReward,
        period: BigNumber.from(stakePeriod), // 60 sec
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenData, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: ethers.utils.parseEther("1.0") });
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.changeEtherBalance(
        this.owner,
        nativeReward.amount.mul(stakeCycles).add(nativeReward.amount),
      );
    });

    it("should stake NATIVE & receive ERC20", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: erc20Reward,
        period: BigNumber.from(stakePeriod), // 60 sec
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenData, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await erc20Instance.mint(stakingInstance.address, erc20Reward.amount.mul(stakeCycles));
      let balance = await erc20Instance.balanceOf(stakingInstance.address);
      expect(balance).to.equal(erc20Reward.amount.mul(stakeCycles));
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Reward.amount.mul(stakeCycles));
      // DEPOSIT
      await expect(tx2).to.changeEtherBalance(this.owner, nativeDeposit.amount);
    });

    it("should stake NATIVE & receive ERC721 Random", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: BigNumber.from(stakePeriod), // 60 sec
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenData, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721RandomInstance, "RandomRequest");
      await expect(tx2).to.emit(linkInstance, "Transfer");
      // RANDOM
      randomRequest(erc721RandomInstance, vrfInstance, 1);
      // DEPOSIT
      await expect(tx2).to.changeEtherBalance(this.owner, nativeDeposit.amount);
    });

    it("should stake NATIVE & receive ERC721 Common", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: erc721RewardSmpl,
        period: BigNumber.from(stakePeriod), // 60 sec
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenData, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721SimpleInstance, "Transfer");
      const balance = await erc721SimpleInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      await expect(tx2).to.changeEtherBalance(this.owner, nativeDeposit.amount);
    });

    it("should stake NATIVE & receive ERC721 Dropbox", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: erc721RewardDbx,
        period: BigNumber.from(stakePeriod), // 60 sec
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenData, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721DropboxInstance, "Transfer");
      const balance = await erc721DropboxInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      await expect(tx2).to.changeEtherBalance(this.owner, nativeDeposit.amount);
    });

    it("should stake NATIVE & receive ERC1155", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: erc1155Reward,
        period: BigNumber.from(stakePeriod), // 60 sec
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      const tx1 = stakingInstance.deposit(1, nativeDeposit.tokenData, { value: nativeDeposit.amount });
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc1155Instance, "TransferSingle");
      const balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenData.tokenId);
      expect(balance).to.equal(erc1155Reward.amount.mul(stakeCycles));
      await expect(tx2).to.changeEtherBalance(this.owner, nativeDeposit.amount);
    });

    it("should stake ERC20 & receive NATIVE", async function () {
      const stakeRule: IRule = {
        deposit: erc20Deposit,
        reward: nativeReward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
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
      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: ethers.utils.parseEther("1.0") });
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.changeEtherBalance(this.owner, nativeReward.amount.mul(stakeCycles));
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
    });

    it("should stake ERC20 & receive ERC20", async function () {
      const stakeRule: IRule = {
        deposit: erc20Deposit,
        reward: erc20Reward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
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
      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await erc20Instance.mint(stakingInstance.address, erc20Reward.amount.mul(stakeCycles));
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Reward.amount.mul(stakeCycles).add(erc20Deposit.amount));
    });

    it("should stake ERC20 & receive ERC721 Random", async function () {
      const stakeRule: IRule = {
        deposit: erc20Deposit,
        reward: erc721RewardRnd,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
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
      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721RandomInstance, "RandomRequest");
      await expect(tx2).to.emit(linkInstance, "Transfer");
      // RANDOM
      randomRequest(erc721RandomInstance, vrfInstance, stakeCycles);
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
    });

    it("should stake ERC20 & receive ERC721 Common", async function () {
      const stakeRule: IRule = {
        deposit: erc20Deposit,
        reward: erc721RewardSmpl,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
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
      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721SimpleInstance, "Transfer");
      balance = await erc721SimpleInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
    });

    it("should stake ERC20 & receive ERC721 Dropbox", async function () {
      const stakeRule: IRule = {
        deposit: erc20Deposit,
        reward: erc721RewardDbx,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
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
      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721DropboxInstance, "Transfer");
      balance = await erc721DropboxInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
    });

    it("should stake ERC20 & receive ERC1155", async function () {
      const stakeRule: IRule = {
        deposit: erc20Deposit,
        reward: erc1155Reward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
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
      const tx1 = stakingInstance.deposit(1, erc20Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");

      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenData.tokenId);
      expect(balance).to.equal(erc1155Reward.amount.mul(stakeCycles));
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Deposit.amount);
    });

    it("should stake ERC721 & receive NATIVE", async function () {
      const stakeRule: IRule = {
        deposit: erc721Deposit,
        reward: nativeReward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.setMaxTemplateId(2);
      await erc721RandomInstance.mintCommon(this.owner.address, 1);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: ethers.utils.parseEther("1.0") });
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.changeEtherBalance(this.owner, nativeReward.amount.mul(stakeCycles));
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should stake ERC721 & receive ERC20", async function () {
      const stakeRule: IRule = {
        deposit: erc721Deposit,
        reward: erc20Reward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.setMaxTemplateId(2);
      await erc721RandomInstance.mintCommon(this.owner.address, 1);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await erc20Instance.mint(stakingInstance.address, erc20Reward.amount.mul(stakeCycles));
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Reward.amount.mul(stakeCycles));
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should stake ERC721 & receive ERC721 Random", async function () {
      const stakeRule: IRule = {
        deposit: erc721Deposit,
        reward: erc721RewardRnd,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.setMaxTemplateId(2);
      await erc721RandomInstance.mintCommon(this.owner.address, 1);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721RandomInstance, "RandomRequest");
      await expect(tx2).to.emit(linkInstance, "Transfer");
      // RANDOM
      randomRequest(erc721RandomInstance, vrfInstance, stakeCycles + 1);
    });

    it("should stake ERC721 & receive ERC721 Common", async function () {
      const stakeRule: IRule = {
        deposit: erc721Deposit,
        reward: erc721RewardSmpl,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.setMaxTemplateId(2);
      await erc721RandomInstance.mintCommon(this.owner.address, 1);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721SimpleInstance, "Transfer");
      balance = await erc721SimpleInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should stake ERC721 & receive ERC721 Dropbox", async function () {
      const stakeRule: IRule = {
        deposit: erc721Deposit,
        reward: erc721RewardDbx,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.setMaxTemplateId(2);
      await erc721RandomInstance.mintCommon(this.owner.address, 1);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721DropboxInstance, "Transfer");
      balance = await erc721DropboxInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should stake ERC721 & receive ERC1155", async function () {
      const stakeRule: IRule = {
        deposit: erc721Deposit,
        reward: erc1155Reward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
      // STAKE
      await erc721RandomInstance.setMaxTemplateId(2);
      await erc721RandomInstance.mintCommon(this.owner.address, 1);
      let balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
      await erc721RandomInstance.approve(stakingInstance.address, 1);
      const tx1 = stakingInstance.deposit(1, erc721Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenData.tokenId);
      expect(balance).to.equal(erc1155Reward.amount.mul(stakeCycles));
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });

    it("should stake ERC1155  & receive NATIVE", async function () {
      const stakeRule: IRule = {
        deposit: erc1155Deposit,
        reward: nativeReward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
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
      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await stakingInstance.fundEth({ value: ethers.utils.parseEther("1.0") });
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.changeEtherBalance(this.owner, nativeReward.amount.mul(stakeCycles));
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenData.tokenId);
      expect(balance).to.equal(erc1155Deposit.amount);
    });

    it("should stake ERC1155  & receive ERC20", async function () {
      const stakeRule: IRule = {
        deposit: erc1155Deposit,
        reward: erc20Reward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
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
      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      await erc20Instance.mint(stakingInstance.address, erc20Reward.amount.mul(stakeCycles));
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(erc20Reward.amount.mul(stakeCycles));
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenData.tokenId);
      expect(balance).to.equal(erc1155Deposit.amount);
    });

    it("should stake ERC1155  & receive ERC721 Random", async function () {
      const stakeRule: IRule = {
        deposit: erc1155Deposit,
        reward: erc721RewardRnd,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
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
      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721RandomInstance, "RandomRequest");
      await expect(tx2).to.emit(linkInstance, "Transfer");
      // RANDOM
      randomRequest(erc721RandomInstance, vrfInstance, 1);
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenData.tokenId);
      expect(balance).to.equal(erc1155Deposit.amount);
    });

    it("should stake ERC1155  & receive ERC721 Common", async function () {
      const stakeRule: IRule = {
        deposit: erc1155Deposit,
        reward: erc721RewardSmpl,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
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
      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721SimpleInstance, "Transfer");
      balance = await erc721SimpleInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenData.tokenId);
      expect(balance).to.equal(erc1155Deposit.amount);
    });

    it("should stake ERC1155  & receive ERC721 Dropbox", async function () {
      const stakeRule: IRule = {
        deposit: erc1155Deposit,
        reward: erc721RewardDbx,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
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
      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc721DropboxInstance, "Transfer");
      balance = await erc721DropboxInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(stakeCycles);
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenData.tokenId);
      expect(balance).to.equal(erc1155Deposit.amount);
    });

    it("should stake ERC1155  & receive ERC1155", async function () {
      const stakeRule: IRule = {
        deposit: erc1155Deposit,
        reward: erc1155Reward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
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
      const tx1 = stakingInstance.deposit(1, erc1155Deposit.tokenData);
      await expect(tx1).to.emit(stakingInstance, "StakingStart");
      await expect(tx1).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * stakeCycles)));
      // REWARD
      const tx2 = await stakingInstance.receiveReward(0, true, true);
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw");
      await expect(tx2).to.emit(stakingInstance, "StakingFinish");
      await expect(tx2).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, erc1155Reward.tokenData.tokenId);
      expect(balance).to.equal(erc1155Reward.amount.mul(stakeCycles).add(erc1155Reward.amount));
    });
  });
});

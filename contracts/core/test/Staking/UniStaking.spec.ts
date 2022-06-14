import { expect } from "chai";
import { ethers, waffle, web3 } from "hardhat";
import { BigNumber } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { UniStaking, ERC721Random, ERC20Simple, ERC1155Simple } from "../../typechain-types";
import { DEFAULT_ADMIN_ROLE, PAUSER_ROLE, _stakePeriod } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { IRule, IItem } from "./interface/staking";

// const transform = (args: any): Record<string, any> => {
//   return JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(args).splice(args.length)))) as Record<
//     string,
//     any
//   >;
// };
// enum ItemType {
// // 0: ETH on mainnet, MATIC on polygon, etc.
// NATIVE,
//   // 1: ERC20 items (ERC777 and other ERC20 analogues could also technically work)
//   ERC20,
//   // 2: ERC721 items
//   ERC721,
//   // 3: ERC1155 items
//   ERC1155
// }
// interface ItemType {
//   itemType = 0 | 1 | 2 | 3 | 4;
// }

describe("UniStaking", function () {
  let stakingInstance: UniStaking;
  let erc721RandomInstance: ERC721Random;
  let erc20Instance: ERC20Simple;
  let erc1155Instance: ERC1155Simple;
  let stakePeriod: number;
  let stakePenalty: number;
  let nativeDeposit: IItem;
  let nativeReward: IItem;
  let erc20Deposit: IItem;
  let erc20Reward: IItem;
  let erc721RewardRnd: IItem;
  let erc721DepositRnd: IItem;
  let erc1155RewardRnd: IItem;
  let erc1155DepositRnd: IItem;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();
    this.provider = waffle.provider;

    // UniStaking
    const stakingFactory = await ethers.getContractFactory("UniStaking");
    stakingInstance = await stakingFactory.deploy();
    // ERC20 Simple
    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    erc20Instance = await erc20Factory.deploy("ERC20Simple", "SMP", 1000000000);
    // ERC721 Random
    const itemFactory = await ethers.getContractFactory("ERC721Random");
    erc721RandomInstance = await itemFactory.deploy("ERC721Random", "RND", "https://localhost", 100);
    // ERC1155
    const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
    erc1155Instance = await erc1155Factory.deploy("https://localhost");

    this.contractInstance = stakingInstance;

    // RULES
    stakePeriod = _stakePeriod; // stake time 60 sec
    stakePenalty = 0; // penalty???

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

    erc721DepositRnd = {
      itemType: BigNumber.from(2), // ERC721
      token: erc721RandomInstance.address,
      tokenData: { tokenId: BigNumber.from(1), templateId: BigNumber.from(0) },
      amount: BigNumber.from(0),
    };

    erc721RewardRnd = {
      itemType: BigNumber.from(2), // ERC721
      token: erc721RandomInstance.address,
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

    erc1155DepositRnd = {
      itemType: BigNumber.from(3), // ERC1155
      token: erc1155Instance.address,
      tokenData: { tokenId: BigNumber.from(1), templateId: BigNumber.from(0) },
      amount: BigNumber.from(100),
    };

    erc1155RewardRnd = {
      itemType: BigNumber.from(3), // ERC1155
      token: erc1155Instance.address,
      tokenData: { tokenId: BigNumber.from(1), templateId: BigNumber.from(0) },
      amount: BigNumber.from(100),
    };
  });

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

    it("should set Rules", async function () {
      const stakeRule: IRule = {
        deposit: nativeDeposit,
        reward: erc721RewardRnd,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      // const xx = [
      //   {
      //     ...stakeRule,
      //     deposit: Object.values(stakeRule.deposit),
      //     reward: Object.values(stakeRule.reward),
      //   },
      // ];
      // const txx = await stakingInstance.setRules(rulesArray);
      // const res = await txx.wait();
      // if (res && res.events) {
      //   const args = res.events[0]!.args;
      //   // console.log("args", args);
      //   const trarg = transform(args!.rule);
      //   console.log("trarg", trarg);
      //   const rulearg = transform(stakeRule);
      //   console.log("rulearg", rulearg);
      //   // expect(trarg).to.equal(rulearg);
      // }

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");
    });
  });

  describe("Stake", function () {
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

      const txx = stakingInstance.deposit(1, erc721RewardRnd.tokenData, { value: BigNumber.from(100) });
      await expect(txx).to.be.revertedWith(`Staking: wrong amount'`);
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

      const txx = stakingInstance.deposit(1, nativeDeposit.tokenData, { value: nativeDeposit.amount });
      await expect(txx).to.emit(stakingInstance, "StakingStart");
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

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // Fund ETH
      await stakingInstance.fundEth({ value: ethers.utils.parseEther("1.0") });

      const txx = stakingInstance.deposit(1, nativeDeposit.tokenData, { value: nativeDeposit.amount });
      await expect(txx).to.emit(stakingInstance, "StakingStart");

      const stakeBalance = await this.provider.getBalance(stakingInstance.address);
      expect(stakeBalance).to.equal(nativeDeposit.amount.add(ethers.utils.parseEther("1.0")));

      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(stakePeriod * 2)));

      const txr = stakingInstance.receiveReward(0, true, true);

      await expect(txr).to.emit(stakingInstance, "StakingWithdraw");
      await expect(txr).to.emit(stakingInstance, "StakingFinish");
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

      const txx = stakingInstance.deposit(1, erc20Deposit.tokenData);
      await expect(txx).to.emit(stakingInstance, "StakingStart");
      await expect(txx).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
    });

    it("should stake ERC721", async function () {
      const stakeRule: IRule = {
        deposit: erc721DepositRnd,
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

      const txx = stakingInstance.deposit(1, erc721DepositRnd.tokenData);
      await expect(txx).to.emit(stakingInstance, "StakingStart");
      await expect(txx).to.emit(erc721RandomInstance, "Transfer");
      balance = await erc721RandomInstance.balanceOf(this.owner.address);
      expect(balance).to.equal(0);
    });

    it("should stake ERC1155", async function () {
      const stakeRule: IRule = {
        deposit: erc1155DepositRnd,
        reward: erc20Reward,
        period: BigNumber.from(stakePeriod),
        penalty: BigNumber.from(stakePenalty),
        recurrent: false,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      await erc1155Instance.mint(this.owner.address, 1, erc1155DepositRnd.amount, "0x");
      let balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(erc1155DepositRnd.amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const txx = stakingInstance.deposit(1, erc1155DepositRnd.tokenData);
      await expect(txx).to.emit(stakingInstance, "StakingStart");
      await expect(txx).to.emit(erc1155Instance, "TransferSingle");
      balance = await erc1155Instance.balanceOf(this.owner.address, 1);
      expect(balance).to.equal(0);
    });
  });
});

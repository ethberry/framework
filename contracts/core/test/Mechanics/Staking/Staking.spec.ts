import { expect } from "chai";
import { ethers, network, web3 } from "hardhat";
import { constants, utils, BigNumber } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { shouldBehaveLikeAccessControl, shouldBehaveLikePausable } from "@gemunion/contracts-mocha";
import {
  amount,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  nonce,
  PAUSER_ROLE,
  TEMPLATE_ID,
} from "@gemunion/contracts-constants";

import { IERC721Random, VRFCoordinatorMock } from "../../../typechain-types";
import { expiresAt, templateId, tokenId, tokenIds, tokenIdsZero } from "../../constants";
import { IRule } from "./interface/staking";
import { randomRequest } from "../../shared/randomRequest";
import { deployLinkVrfFixture } from "../../shared/link";
import { deployStaking } from "./shared/fixture";
import { deployERC20 } from "../../ERC20/shared/fixtures";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { deployERC1155 } from "../../ERC1155/shared/fixtures";
import { shouldBehaveLikeTopUp } from "../../shared/topUp";

/*
1. Calculate multiplier (count full periods since stake start)

2. Deposit withdraw
  2.1 If withdrawDeposit || ( multiplier > 0 && !rule.recurrent ) || ( stake.cycles > 0 && breakLastPeriod )

    2.1.1 If multiplier == 0                       -> deduct penalty from deposit amount
    2.1.2 Transfer deposit to user account         -> spend(_toArray(depositItem), receiver)

  2.2 Else -> update stake.startTimestamp = block.timestamp

3. Reward transfer
  3.1 If multiplier > 0                            -> transfer reward amount * multiplier to receiver

4. If multiplier == 0 && rule.recurrent && !withdrawDeposit && !breakLastPeriod
                                                   -> revert with Error ( first period not yet finished )
*/
/*
MULTIPLIER - RECURRENT - WITHDRAW_DEPOSIT - BREAK_LAST_PERIOD === DECISION
   0            0             0                   0           === WITHDRAW DEPOSIT

   1            0             0                   0           === WITHDRAW DEPOSIT AND REWARD
   0            1             0                   0           === REVERT (NOTHING TO DO)
   0            0             1                   0           === WITHDRAW DEPOSIT
   0            0             0                   1           === WITHDRAW DEPOSIT

   1            1             0                   0           === WITHDRAW REWARD AND SET NEW TIME
   0            1             1                   0           === WITHDRAW DEPOSIT
   0            0             1                   1           === WITHDRAW DEPOSIT
   1            0             0                   1           === WITHDRAW DEPOSIT

   1            1             1                   0           === WITHDRAW DEPOSIT AND REWARD
   0            1             1                   1           === WITHDRAW DEPOSIT
   1            0             1                   1           === WITHDRAW DEPOSIT AND REWARD
   1            1             0                   1           === WITHDRAW DEPOSIT AND REWARD

   1            1             1                   1           === WITHDRAW DEPOSIT AND REWARD
*/

describe("Staking", function () {
  const period = 300;
  const penalty = 0;
  const cycles = 2;
  const params = {
    nonce,
    externalId: 1,
    expiresAt,
    referrer: constants.AddressZero,
  };

  let vrfInstance: VRFCoordinatorMock;

  const factory = () => deployStaking();
  const erc20Factory = () => deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
  const erc721Factory = (name: string) => deployERC721(name);
  const erc1155Factory = () => deployERC1155();

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldBehaveLikePausable(factory);
  shouldBehaveLikeTopUp(factory);

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
        recurrent: true,
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
        recurrent: true,
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
        recurrent: true,
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
        recurrent: true,
        active: true,
      };

      const stakeRule2: IRule = {
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
        recurrent: true,
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
        recurrent: true,
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
      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(
        {
          nonce,
          externalId: 2,
          expiresAt,
          referrer: constants.AddressZero,
        },
        tokenIds,
        { value: 100 },
      );
      await expect(tx1).to.be.revertedWith("Staking: rule does not exist");
    });

    it("should fail for not active rule", async function () {
      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      const stakeRule: IRule = {
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
        recurrent: true,
        active: false,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(params, tokenIds, { value: amount });
      await expect(tx1).to.be.revertedWith("Staking: rule doesn't active");
    });

    it("should fail for wrong pay amount", async function () {
      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(params, tokenIds, { value: 100 });
      await expect(tx1).to.be.revertedWith("Exchange: Wrong amount");
    });

    it("should fail for limit exceed", async function () {
      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      await stakingInstance.setMaxStake(1);

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      const tx1 = stakingInstance.deposit(params, tokenIds, { value: amount });
      await expect(tx1).to.not.be.reverted;

      const tx2 = stakingInstance.deposit(params, tokenIds, { value: amount });
      await expect(tx2).to.be.revertedWith("Staking: stake limit exceeded");
    });
  });

  describe("Reward", function () {
    it("should fail for wrong staking id", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.connect(receiver).deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, receiver.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([receiver, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // REWARD
      await stakingInstance.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount: amount * cycles,
          },
        ],
        { value: amount * cycles },
      );
      const tx2 = stakingInstance.connect(receiver).receiveReward(2, true, true);
      await expect(tx2).to.be.revertedWith("Staking: wrong staking id");
    });

    it("should fail for not an owner", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.connect(receiver).deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, receiver.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([receiver, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // REWARD
      await stakingInstance.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount: amount * cycles,
          },
        ],
        { value: amount * cycles },
      );
      const tx2 = stakingInstance.receiveReward(1, true, true);
      await expect(tx2).to.be.revertedWith("Staking: not an owner");
    });

    it("should fail for withdrawn already", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.connect(receiver).deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, receiver.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([receiver, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // REWARD
      await stakingInstance.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount: amount * cycles,
          },
        ],
        { value: amount * cycles },
      );

      const tx2 = await stakingInstance.connect(receiver).receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, receiver.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, receiver.address, endTimestamp, cycles);
      await expect(tx2).to.changeEtherBalance(receiver, amount * cycles + amount);

      const tx3 = stakingInstance.connect(receiver).receiveReward(1, true, true);
      await expect(tx3).to.be.revertedWith("Staking: deposit withdrawn already");
    });

    it("should fail deposit for wrong tokenId", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      const stakeRule: IRule = {
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
        recurrent: true,
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
      const tx1 = stakingInstance.deposit(params, [2]);
      await expect(tx1).to.be.revertedWith("Staking: wrong deposit token templateID");
    });

    it("should fail first period not yet finished", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME
      // REWARD

      const tx2 = stakingInstance.receiveReward(1, false, false);
      await expect(tx2).to.be.revertedWith("Staking: first period not yet finished");
    });
  });

  describe("Permutations", function () {
    it("should stake NATIVE & receive NOTHING", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
        ],
        reward: [],
        content: [],
        period, // 60 sec
        penalty,
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // REWARD NOTHING
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles);
    });

    it("should stake NATIVE & receive NATIVE", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // REWARD
      await stakingInstance.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount: amount * cycles,
          },
        ],
        { value: amount * cycles },
      );

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles);
      await expect(tx2).to.changeEtherBalances(
        [owner, stakingInstance],
        [amount * cycles + amount, -amount * cycles - amount],
      );
    });

    it("should stake NATIVE & receive NATIVE (not recurrent)", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
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
      const tx1 = await stakingInstance.deposit(params, tokenIdsZero, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIdsZero);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // REWARD
      await stakingInstance.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId: 0,
            amount: amount * cycles,
          },
        ],
        { value: amount * cycles },
      );

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, 1);
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount + amount, -amount - amount]);
    });

    it("should stake NATIVE & receive NATIVE (recurrent)", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
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
        penalty: 5000, // 50%
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // FUND REWARD
      await stakingInstance.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount: amount * cycles,
          },
        ],
        { value: amount * cycles },
      );

      // TIME 1
      const current1 = await time.latestBlock();
      await time.advanceBlockTo(current1.add(web3.utils.toBN(period + 1)));

      // REWARD 1
      const tx2 = await stakingInstance.receiveReward(1, false, false);
      const endTimestamp: number = (await time.latest()).toNumber();

      await expect(tx2).to.emit(stakingInstance, "StakingFinish").withArgs(1, owner.address, endTimestamp, 1);

      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      // TIME 2
      const current2 = await time.latestBlock();
      await time.advanceBlockTo(current2.add(web3.utils.toBN(period + 1)));

      // REWARD 2
      const tx3 = await stakingInstance.receiveReward(1, false, false);
      const endTimestamp2: number = (await time.latest()).toNumber();
      await expect(tx3).to.emit(stakingInstance, "StakingFinish").withArgs(1, owner.address, endTimestamp2, 1);
      await expect(tx3).to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      // REWARD 3
      const tx4 = await stakingInstance.receiveReward(1, false, true);
      const endTimestamp3: number = (await time.latest()).toNumber();
      await expect(tx4).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp3);
      await expect(tx4).to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      const stake = await stakingInstance.getStake(1);
      expect(stake).to.have.deep.nested.property("cycles", BigNumber.from(2));
      expect(stake).to.have.deep.nested.property("activeDeposit", false);
    });

    it("should stake NATIVE & receive ERC20", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

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
        .withArgs(stakingInstance.address, owner.address, amount * cycles);
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(amount * cycles);
    });

    it("should stake NATIVE & receive ERC721 Random", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
      await erc721RandomInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      // Add Consumer to VRF_V2
      const tx02 = vrfInstance.addConsumer(1, erc721RandomInstance.address);
      await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721RandomInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

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
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      // RANDOM
      await randomRequest(erc721RandomInstance as IERC721Random, vrfInstance);
      const balance = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance).to.equal(cycles);
    });

    it("should stake NATIVE & receive ERC721 Common", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

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
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      const balance = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance).to.equal(cycles);
    });

    it("should stake NATIVE & receive ERC721 Mysterybox", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const mysteryboxInstance = await erc721Factory("ERC721MysteryboxSimple");

      await mysteryboxInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

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
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      const balance = await mysteryboxInstance.balanceOf(owner.address);
      expect(balance).to.equal(cycles);
    });

    it("should stake NATIVE & receive ERC1155", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc1155Instance = await erc1155Factory();

      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

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
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      const balance = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance).to.equal(amount * cycles);
    });

    it("should stake ERC20 & receive NATIVE", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenIds)
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
      await stakingInstance.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount: amount * cycles,
          },
        ],
        { value: amount * cycles },
      );

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles);
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount * cycles, -amount * cycles]);

      const balance3 = await erc20Instance.balanceOf(owner.address);
      expect(balance3).to.equal(amount);
    });

    it("should stake ERC20 & receive ERC20", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
      await erc721RandomInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      // Add Consumer to VRF_V2
      const tx02 = vrfInstance.addConsumer(1, erc721RandomInstance.address);
      await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721RandomInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const mysteryboxInstance = await erc721Factory("ERC721MysteryboxSimple");

      await mysteryboxInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenIds)
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

    it("should stake ERC20 & receive MIXED REWARD (ERC20 + ERC721 Mysterybox)", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const mysteryboxInstance = await erc721Factory("ERC721MysteryboxSimple");

      await mysteryboxInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
          {
            tokenType: 2, // ERC721
            token: mysteryboxInstance.address,
            tokenId,
            amount,
          },
        ],
        content: [
          [],
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenIds)
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
        .to.emit(mysteryboxInstance, "Transfer")
        .withArgs(constants.AddressZero, owner.address, tokenId)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, amount * cycles);

      const balance3 = await mysteryboxInstance.balanceOf(owner.address);
      expect(balance3).to.equal(cycles);
      const balance4 = await erc20Instance.balanceOf(owner.address);
      expect(balance4).to.equal(amount * cycles + amount /* deposit */);
    });

    it("should stake MIXED (ERC20 + NATIVE) & receive MIXED REWARD (ERC721 Common + ERC721 Common)", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        deposit: [
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
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
            amount: 0,
          },
        ],
        content: [
          [],
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, [0, 0], { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, [0, 0])
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x");
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

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
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(constants.AddressZero, owner.address, tokenId)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, amount);
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      const balance3 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance3).to.equal(cycles);
      const balance4 = await erc20Instance.balanceOf(owner.address);
      expect(balance4).to.equal(amount /* deposit */);
    });

    it("should stake ERC20 & receive ERC1155", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc1155Instance = await erc1155Factory();

      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
      await erc721RandomInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
        .to.emit(erc721RandomInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId);

      const balance2 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance2).to.equal(0);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // REWARD
      await stakingInstance.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount: amount * cycles,
          },
        ],
        { value: amount * cycles },
      );

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles);
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount * cycles, -amount * cycles]);

      const balance3 = await erc721RandomInstance.balanceOf(owner.address);
      expect(balance3).to.equal(1);
    });

    it("should stake ERC721 & receive ERC20", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
      await erc721RandomInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      // Add Consumer to VRF_V2
      const tx02 = vrfInstance.addConsumer(1, erc721RandomInstance.address);
      await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721RandomInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");
      const mysteryboxInstance = await erc721Factory("ERC721MysteryboxSimple");

      await mysteryboxInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");
      const erc1155Instance = await erc1155Factory();

      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc1155Instance = await erc1155Factory();

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, owner.address, stakingInstance.address, tokenId, amount);

      const balance2 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance2).to.equal(0);

      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // REWARD
      await stakingInstance.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount: amount * cycles,
          },
        ],
        { value: amount * cycles },
      );

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, owner.address, endTimestamp, cycles);
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount * cycles, -amount * cycles]);

      const balance3 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance3).to.equal(amount);
    });

    it("should stake ERC1155 & receive ERC20", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc1155Instance = await erc1155Factory();

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721RandomInstance = await erc721Factory("ERC721RandomHardhat");
      const erc1155Instance = await erc1155Factory();

      await erc721RandomInstance.grantRole(MINTER_ROLE, vrfInstance.address);
      await erc721RandomInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      // Add Consumer to VRF_V2
      const tx02 = vrfInstance.addConsumer(1, erc721RandomInstance.address);
      await expect(tx02).to.emit(vrfInstance, "SubscriptionConsumerAdded").withArgs(1, erc721RandomInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const erc1155Instance = await erc1155Factory();

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const mysteryboxInstance = await erc721Factory("ERC721MysteryboxSimple");
      const erc1155Instance = await erc1155Factory();

      await mysteryboxInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
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
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc1155Instance = await erc1155Factory();

      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
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
        .withArgs(stakingInstance.address, stakingInstance.address, owner.address, tokenId, amount)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, constants.AddressZero, owner.address, tokenId, amount * cycles);

      const balance3 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance3).to.equal(amount * cycles + amount);
    });
  });

  describe("Permutations with penalty", function () {
    it("should stake NATIVE & receive DEPOSIT with 50% penalty", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
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
        penalty: 5000, // 50%
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME

      // REWARD
      await stakingInstance.topUp(
        [
          {
            tokenType: 0,
            token: constants.AddressZero,
            tokenId,
            amount: amount * cycles,
          },
        ],
        { value: amount * cycles },
      );

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();

      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount / 2, -amount / 2]);
    });

    it("should stake ERC20 & receive DEPOSIT with 50% penalty", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
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
        penalty: 5000, // 50%
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, tokenIds)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x");

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);

      // TIME

      // REWARD
      await erc20Instance.mint(stakingInstance.address, amount * cycles);

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, amount / 2);

      const balance3 = await erc20Instance.balanceOf(owner.address);
      expect(balance3).to.equal(amount / 2);
    });

    it("should stake ERC721 & receive DEPOSIT with 0% penalty", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        deposit: [
          {
            tokenType: 2, // ERC721
            token: erc721SimpleInstance.address,
            tokenId,
            amount: 1,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721SimpleInstance.address,
            tokenId: 2,
            amount: 1,
          },
        ],
        content: [],
        period,
        penalty: 5000, // 50%
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      await erc721SimpleInstance.mintCommon(owner.address, templateId);
      const balance1 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance1).to.equal(1);
      await erc721SimpleInstance.approve(stakingInstance.address, 1);

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId);

      const balance2 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance2).to.equal(0);

      // TIME

      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);
      await expect(tx2)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, tokenId);

      const balance4 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance4).to.equal(1);
    });

    it("should stake ERC721 & DO NOT receive DEPOSIT ( 100% penalty )", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        deposit: [
          {
            tokenType: 2, // ERC721
            token: erc721SimpleInstance.address,
            tokenId,
            amount: 1,
          },
        ],
        reward: [
          {
            tokenType: 2, // ERC721
            token: erc721SimpleInstance.address,
            tokenId: 2,
            amount: 1,
          },
        ],
        content: [],
        period,
        penalty: 10000, // 100%
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      await erc721SimpleInstance.mintCommon(owner.address, templateId);
      const balance1 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance1).to.equal(1);
      await erc721SimpleInstance.approve(stakingInstance.address, 1);

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId);

      const balance2 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance2).to.equal(0);

      // TIME

      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);

      const balance4 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance4).to.equal(0);
    });

    it("should stake ERC1155 & receive DEPOSIT with 50% penalty", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc1155Instance = await erc1155Factory();

      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
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
        penalty: 5000, // 50%
        recurrent: true,
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

      const tx1 = await stakingInstance.deposit(params, tokenIds);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIds)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, owner.address, stakingInstance.address, tokenId, amount);

      const balance2 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance2).to.equal(0);

      // TIME

      // REWARD
      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);

      await expect(tx2)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, stakingInstance.address, owner.address, tokenId, amount / 2);

      const balance3 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance3).to.equal(amount / 2);
    });

    it("should stake MIXED (NATIVE + ERC20 + ERC721 + ERC1155) & receive MIXED DEPOSIT with 50% penalty (ERC721 0% penalty)", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const erc1155Instance = await erc1155Factory();

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);
      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
          {
            tokenType: 2, // ERC721
            token: erc721SimpleInstance.address,
            tokenId,
            amount: 1,
          },
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
            amount: 0,
          },
        ],
        content: [[], [], [], []],
        period,
        penalty: 5000, // 50%
        recurrent: true,
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

      await erc721SimpleInstance.mintCommon(owner.address, templateId);
      const balance11 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance11).to.equal(1);
      await erc721SimpleInstance.approve(stakingInstance.address, 1);

      await erc1155Instance.mint(owner.address, 1, amount, "0x");
      const balance12 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance12).to.equal(amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const tx1 = await stakingInstance.deposit(params, [0, 0, 1, 1], { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, [0, 0])
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x")
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, owner.address, stakingInstance.address, tokenId, amount);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      const balance21 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance21).to.equal(0);
      const balance22 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance22).to.equal(0);

      // TIME

      // REWARD
      await erc20Instance.mint(stakingInstance.address, amount * cycles);

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, amount / 2)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, tokenId)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, stakingInstance.address, owner.address, tokenId, amount / 2);
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount / 2, -amount / 2]);

      const balance4 = await erc20Instance.balanceOf(owner.address);
      expect(balance4).to.equal(amount / 2 /* deposit */);
      const balance41 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance41).to.equal(1);
      const balance42 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance42).to.equal(amount / 2);
    });

    it("should stake MIXED (NATIVE + ERC20 + ERC721 + ERC1155) & receive MIXED DEPOSIT with 100% penalty", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const erc1155Instance = await erc1155Factory();

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);
      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
          {
            tokenType: 2, // ERC721
            token: erc721SimpleInstance.address,
            tokenId,
            amount: 1,
          },
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
            amount: 0,
          },
        ],
        content: [[], [], [], []],
        period,
        penalty: 10000, // 100%
        recurrent: true,
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

      await erc721SimpleInstance.mintCommon(owner.address, templateId);
      const balance11 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance11).to.equal(1);
      await erc721SimpleInstance.approve(stakingInstance.address, 1);

      await erc1155Instance.mint(owner.address, 1, amount, "0x");
      const balance12 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance12).to.equal(amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const tx1 = await stakingInstance.deposit(params, [0, 0, 1, 1], { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, [0, 0])
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x")
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, owner.address, stakingInstance.address, tokenId, amount);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      const balance21 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance21).to.equal(0);
      const balance22 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance22).to.equal(0);

      // TIME

      // REWARD
      await erc20Instance.mint(stakingInstance.address, amount * cycles);

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);

      const balance4 = await erc20Instance.balanceOf(owner.address);
      expect(balance4).to.equal(0);
      const balance41 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance41).to.equal(0);
      const balance42 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance42).to.equal(0);
    });
  });

  describe("Withdraw penalty", function () {
    it("should stake mixed (NATIVE + ERC20 + ERC721 + ERC1155) & withdraw 50 % mixed PENALTIES (ERC721 0% penalty)", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const erc1155Instance = await erc1155Factory();

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);
      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
          {
            tokenType: 2, // ERC721
            token: erc721SimpleInstance.address,
            tokenId,
            amount: 1,
          },
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
            amount: 0,
          },
        ],
        content: [[], [], [], []],
        period,
        penalty: 5000, // 50%
        recurrent: true,
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

      await erc721SimpleInstance.mintCommon(owner.address, templateId);
      const balance11 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance11).to.equal(1);
      await erc721SimpleInstance.approve(stakingInstance.address, 1);

      await erc1155Instance.mint(owner.address, 1, amount, "0x");
      const balance12 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance12).to.equal(amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const tx1 = await stakingInstance.deposit(params, [0, 0, 1, 1], { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, [0, 0])
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x")
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, owner.address, stakingInstance.address, tokenId, amount);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      const balance21 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance21).to.equal(0);
      const balance22 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance22).to.equal(0);

      // TIME

      // REWARD
      await erc20Instance.mint(stakingInstance.address, amount * cycles);

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, owner.address, endTimestamp)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, amount / 2)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, tokenId)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, stakingInstance.address, owner.address, tokenId, amount / 2);
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount / 2, -amount / 2]);

      const balance4 = await erc20Instance.balanceOf(owner.address);
      expect(balance4).to.equal(amount / 2 /* deposit */);
      const balance41 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance41).to.equal(1);
      const balance42 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance42).to.equal(amount / 2);

      // WITHDRAW PENALTY
      const tx3 = stakingInstance.withdrawBalance(constants.AddressZero, 0, 0);
      await expect(tx3)
        .to.emit(stakingInstance, "WithdrawBalance")
        .withArgs(constants.AddressZero, 0, amount / 2);
      await expect(tx3).to.changeEtherBalances([owner, stakingInstance], [amount / 2, -amount / 2]);

      const tx4 = stakingInstance.withdrawBalance(erc20Instance.address, 0, 1);
      await expect(tx4)
        .to.emit(stakingInstance, "WithdrawBalance")
        .withArgs(erc20Instance.address, 0, amount / 2);

      const tx5 = stakingInstance.withdrawBalance(erc721SimpleInstance.address, tokenId, 2);
      await expect(tx5).to.be.revertedWith("Staking: zero balance");

      const tx6 = stakingInstance.withdrawBalance(erc1155Instance.address, tokenId, 4);
      await expect(tx6)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, stakingInstance.address, owner.address, tokenId, amount / 2);
    });

    it("should stake mixed (NATIVE + ERC20 + ERC721 + ERC1155) & withdraw 1000 % mixed PENALTIES", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();
      const erc721SimpleInstance = await erc721Factory("ERC721Simple");
      const erc1155Instance = await erc1155Factory();

      await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);
      await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

      const stakeRule: IRule = {
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId,
            amount,
          },
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId,
            amount,
          },
          {
            tokenType: 2, // ERC721
            token: erc721SimpleInstance.address,
            tokenId,
            amount: 1,
          },
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
            amount: 0,
          },
        ],
        content: [[], [], [], []],
        period,
        penalty: 10000, // 100%
        recurrent: true,
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

      await erc721SimpleInstance.mintCommon(owner.address, templateId);
      const balance11 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance11).to.equal(1);
      await erc721SimpleInstance.approve(stakingInstance.address, 1);

      await erc1155Instance.mint(owner.address, 1, amount, "0x");
      const balance12 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance12).to.equal(amount);
      await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

      const tx1 = await stakingInstance.deposit(params, [0, 0, 1, 1], { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, owner.address, startTimestamp, [0, 0])
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x")
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, tokenId)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, owner.address, stakingInstance.address, tokenId, amount);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      const balance21 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance21).to.equal(0);
      const balance22 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance22).to.equal(0);

      // TIME

      // REWARD
      await erc20Instance.mint(stakingInstance.address, amount * cycles);

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);

      const balance4 = await erc20Instance.balanceOf(owner.address);
      expect(balance4).to.equal(0);
      const balance41 = await erc721SimpleInstance.balanceOf(owner.address);
      expect(balance41).to.equal(0);
      const balance42 = await erc1155Instance.balanceOf(owner.address, 1);
      expect(balance42).to.equal(0);

      // WITHDRAW PENALTY
      const tx3 = stakingInstance.withdrawBalance(constants.AddressZero, 0, 0);
      await expect(tx3).to.emit(stakingInstance, "WithdrawBalance").withArgs(constants.AddressZero, 0, amount);
      await expect(tx3).to.changeEtherBalances([owner, stakingInstance], [amount, -amount]);

      const tx4 = stakingInstance.withdrawBalance(erc20Instance.address, 0, 1);
      await expect(tx4).to.emit(stakingInstance, "WithdrawBalance").withArgs(erc20Instance.address, 0, amount);

      const tx5 = stakingInstance.withdrawBalance(erc721SimpleInstance.address, tokenId, 2);
      await expect(tx5)
        .to.emit(erc721SimpleInstance, "Transfer")
        .withArgs(stakingInstance.address, owner.address, tokenId);

      const tx6 = stakingInstance.withdrawBalance(erc1155Instance.address, tokenId, 4);
      await expect(tx6)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(stakingInstance.address, stakingInstance.address, owner.address, tokenId, amount);
    });

    it("should fail withdraw: zero balance", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();
      const tx0 = stakingInstance.withdrawBalance(constants.AddressZero, 0, 0);
      await expect(tx0).to.be.revertedWith("Staking: zero balance");

      const stakeRule: IRule = {
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount,
          },
        ],
        content: [[]],
        period,
        penalty: 5000, // 50%
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(params, tokenIdsZero, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIdsZero);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME
      // REWARD

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);

      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount / 2, -amount / 2]);

      // WITHDRAW PENALTY
      const tx3 = stakingInstance.withdrawBalance(constants.AddressZero, 0, 0);
      await expect(tx3)
        .to.emit(stakingInstance, "WithdrawBalance")
        .withArgs(constants.AddressZero, 0, amount / 2);
      await expect(tx3).to.changeEtherBalances([owner, stakingInstance], [amount / 2, -amount / 2]);

      const tx4 = stakingInstance.withdrawBalance(constants.AddressZero, 0, 0);
      await expect(tx4).to.be.revertedWith("Staking: zero balance");
    });

    it("should fail withdraw: UnsupportedTokenType", async function () {
      const [owner] = await ethers.getSigners();

      const stakingInstance = await factory();

      const stakeRule: IRule = {
        deposit: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount,
          },
        ],
        reward: [
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount,
          },
        ],
        content: [[]],
        period,
        penalty: 5000, // 50%
        recurrent: true,
        active: true,
      };

      // SET RULE
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE
      const tx1 = await stakingInstance.deposit(params, tokenIdsZero, { value: amount });
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, tokenId, owner.address, startTimestamp, tokenIdsZero);
      await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

      // TIME
      // REWARD

      const tx2 = await stakingInstance.receiveReward(1, true, true);
      const endTimestamp: number = (await time.latest()).toNumber();
      await expect(tx2).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);
      await expect(tx2).to.changeEtherBalances([owner, stakingInstance], [amount / 2, -amount / 2]);

      // WITHDRAW PENALTY
      const tx3 = stakingInstance.withdrawBalance(constants.AddressZero, 0, 5);
      await expect(tx3).to.be.reverted;
    });

    it("should fail withdraw: balance exceeded", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const stakingInstance = await factory();
      const erc20Instance = await erc20Factory();

      // SET RULE 1
      const stakeRule: IRule = {
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
        content: [[]],
        period,
        penalty: 5000, // 50%
        recurrent: true,
        active: true,
      };
      const tx = stakingInstance.setRules([stakeRule]);
      await expect(tx).to.emit(stakingInstance, "RuleCreated");

      // STAKE 1
      await erc20Instance.mint(receiver.address, amount);
      const balance1 = await erc20Instance.balanceOf(receiver.address);
      expect(balance1).to.equal(amount);
      await erc20Instance.connect(receiver).approve(stakingInstance.address, amount);

      // DEPOSIT 1
      const tx1 = await stakingInstance.connect(receiver).deposit(params, tokenIdsZero);
      const startTimestamp: number = (await time.latest()).toNumber();
      await expect(tx1)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(1, 1, receiver.address, startTimestamp, tokenIdsZero)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(receiver.address, stakingInstance.address, amount)
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, receiver.address, amount, "0x");

      const balance2 = await erc20Instance.balanceOf(receiver.address);
      expect(balance2).to.equal(0);

      // SET RULE 2
      const stakeRule1: IRule = {
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
        content: [[]],
        period,
        penalty: 10000, // 100%
        recurrent: true,
        active: true,
      };
      const tx10 = stakingInstance.setRules([stakeRule1]);
      await expect(tx10).to.emit(stakingInstance, "RuleCreated");

      // STAKE 2
      await erc20Instance.mint(owner.address, amount);
      const balance10 = await erc20Instance.balanceOf(owner.address);
      expect(balance10).to.equal(amount);
      await erc20Instance.approve(stakingInstance.address, amount);

      // TIME 1
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));

      // DEPOSIT 2
      const tx11 = await stakingInstance.deposit(
        {
          nonce,
          externalId: 2, // ruleId
          expiresAt,
          referrer: constants.AddressZero,
        },
        tokenIdsZero,
      );
      const startTimestamp1: number = (await time.latest()).toNumber();
      await expect(tx11)
        .to.emit(stakingInstance, "StakingStart")
        .withArgs(2, 2, owner.address, startTimestamp1, tokenIdsZero)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, stakingInstance.address, amount)
        .to.emit(stakingInstance, "TransferReceived")
        .withArgs(stakingInstance.address, owner.address, amount, "0x");

      const balance21 = await erc20Instance.balanceOf(owner.address);
      expect(balance21).to.equal(0);

      // REWARD 1
      await erc20Instance.mint(stakingInstance.address, amount * (cycles - 1)); // not enough for penalty after
      const tx21 = await stakingInstance.connect(receiver).receiveReward(1, true, true);
      const endTimestamp1: number = (await time.latest()).toNumber();
      await expect(tx21)
        .to.emit(stakingInstance, "StakingWithdraw")
        .withArgs(1, receiver.address, endTimestamp1)
        .to.emit(stakingInstance, "StakingFinish")
        .withArgs(1, receiver.address, endTimestamp1, cycles)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(stakingInstance.address, receiver.address, amount * cycles);

      const balance3 = await erc20Instance.balanceOf(receiver.address);
      expect(balance3).to.equal(amount * cycles + amount);

      // REWARD 2
      // await erc20Instance.mint(stakingInstance.address, amount * (cycles - 1)); // not enough for penalty
      const tx22 = await stakingInstance.receiveReward(2, true, true);
      const endTimestamp2: number = (await time.latest()).toNumber();
      await expect(tx22).to.emit(stakingInstance, "StakingWithdraw").withArgs(2, owner.address, endTimestamp2);

      const balance32 = await erc20Instance.balanceOf(owner.address);
      expect(balance32).to.equal(0);

      // WITHDRAW PENALTY
      const tx3 = stakingInstance.withdrawBalance(erc20Instance.address, 0, 1);
      await expect(tx3).to.be.revertedWith("Staking: balance exceeded");
    });
  });
});

import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { BigNumber, constants, Contract, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { amount, DEFAULT_ADMIN_ROLE, MINTER_ROLE, nonce } from "@gemunion/contracts-constants";

import { expiresAt, extra, templateId, tokenId, tokenIds } from "../../../constants";
import { IRule } from "../interface/staking";
import { deployERC20 } from "../../../ERC20/shared/fixtures";
import { deployERC721 } from "../../../ERC721/shared/fixtures";
import { deployERC1155 } from "../../../ERC1155/shared/fixtures";

export function shouldHaveReentrancyGuard(factory: () => Promise<Contract>) {
  const period = 30;
  const cycles = 2;
  const maxStake = 2;

  const params = {
    nonce,
    externalId: 1,
    expiresAt,
    referrer: constants.AddressZero,
    extra,
  };

  const erc20Factory = () => deployERC20("ERC20Simple", { amount: utils.parseEther("200000") });
  const erc721Factory = (name: string) => deployERC721(name);
  const erc1155Factory = () => deployERC1155();

  describe("Reentrancy Guard", function () {
    describe("receiveReward", function () {
      it("should not call twice (NATIVE)", async function () {
        const [owner] = await ethers.getSigners();

        const stakingInstance = await factory();
        const Attaker = await ethers.getContractFactory("ReentrancyStakingReward");
        const attakerInstance = await Attaker.deploy(stakingInstance.address);

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
          maxStake, recurrent: true,
          active: true,
        };

        // SET RULE
        const tx = stakingInstance.setRules([stakeRule]);
        await expect(tx).to.emit(stakingInstance, "RuleCreated");

        // STAKE
        // const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
        const tx1 = await attakerInstance.deposit(params, tokenIds, { value: amount });
        const startTimestamp: number = (await time.latest()).toNumber();
        await expect(tx1)
          .to.emit(stakingInstance, "StakingStart")
          .withArgs(1, tokenId, attakerInstance.address, startTimestamp, tokenIds);
        await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);
        // return

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
        // const tx2 = await stakingInstance.receiveReward(1, false, false);
        const tx2 = await attakerInstance.receiveReward(1, false, false);
        const endTimestamp: number = (await time.latest()).toNumber();

        await expect(tx2).to.changeEtherBalances([attakerInstance, stakingInstance], [amount, -amount]);
        await expect(tx2).to.emit(attakerInstance, "Reentered").withArgs(false);
        await expect(tx2)
          .to.emit(stakingInstance, "StakingFinish")
          .withArgs(1, attakerInstance.address, endTimestamp, 1);
      });

      it("should not call twice (ERC20)", async function () {
        const [owner] = await ethers.getSigners();
        const stakingInstance = await factory();
        const erc20Instance = await erc20Factory();

        const Attaker = await ethers.getContractFactory("ReentrancyStakingReward");
        const attakerInstance = await Attaker.deploy(stakingInstance.address);

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
          penalty: 5000, // 50%
          maxStake, recurrent: true,
          active: true,
        };

        // SET RULE
        const tx = stakingInstance.setRules([stakeRule]);
        await expect(tx).to.emit(stakingInstance, "RuleCreated");

        // STAKE
        // const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
        const tx1 = await attakerInstance.deposit(params, tokenIds, { value: amount });
        const startTimestamp: number = (await time.latest()).toNumber();
        await expect(tx1)
          .to.emit(stakingInstance, "StakingStart")
          .withArgs(1, tokenId, attakerInstance.address, startTimestamp, tokenIds);
        await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);
        // return

        // FUND REWARD
        await erc20Instance.mint(stakingInstance.address, amount * cycles);

        // TIME 1
        const current1 = await time.latestBlock();
        await time.advanceBlockTo(current1.add(web3.utils.toBN(period + 1)));

        // REWARD 1
        const tx2 = await attakerInstance.receiveReward(1, false, false);
        const endTimestamp: number = (await time.latest()).toNumber();

        await expect(tx2).to.changeTokenBalances(
          erc20Instance,
          [attakerInstance, stakingInstance],
          [amount, amount * -1],
        );
        await expect(tx2).to.emit(attakerInstance, "Reentered").withArgs(false);
        await expect(tx2)
          .to.emit(stakingInstance, "StakingFinish")
          .withArgs(1, attakerInstance.address, endTimestamp, 1);
      });

      it("should not call twice (ERC721)", async function () {
        const [owner] = await ethers.getSigners();
        const stakingInstance = await factory();
        const erc721SimpleInstance = await erc721Factory("ERC721Simple");

        await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);

        const Attaker = await ethers.getContractFactory("ReentrancyStakingReward");
        const attakerInstance = await Attaker.deploy(stakingInstance.address);

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
              tokenType: 2, // NATIVE
              token: erc721SimpleInstance.address,
              tokenId,
              amount,
            },
          ],
          content: [],
          period, // 60 sec
          penalty: 5000, // 50%
          maxStake, recurrent: true,
          active: true,
        };

        // SET RULE
        const tx = stakingInstance.setRules([stakeRule]);
        await expect(tx).to.emit(stakingInstance, "RuleCreated");

        // STAKE
        // const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
        const tx1 = await attakerInstance.deposit(params, tokenIds, { value: amount });
        const startTimestamp: number = (await time.latest()).toNumber();
        await expect(tx1)
          .to.emit(stakingInstance, "StakingStart")
          .withArgs(1, tokenId, attakerInstance.address, startTimestamp, tokenIds);
        await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);
        // return

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
        const tx2 = await attakerInstance.receiveReward(1, false, false);
        const endTimestamp: number = (await time.latest()).toNumber();
        const balance = await erc721SimpleInstance.balanceOf(attakerInstance.address);

        expect(balance).to.be.equal(1);
        await expect(tx2).to.emit(attakerInstance, "Reentered").withArgs(false);
        await expect(tx2)
          .to.emit(stakingInstance, "StakingFinish")
          .withArgs(1, attakerInstance.address, endTimestamp, 1);

        // await expect(tx2).to.changeEtherBalances([attakerInstance, stakingInstance], [amount, -amount]);
      });

      it("should not call twice (ERC1155)", async function () {
        const [owner] = await ethers.getSigners();
        const stakingInstance = await factory();
        const erc1155Instance = await erc1155Factory();

        await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);

        const Attaker = await ethers.getContractFactory("ReentrancyStakingReward");
        const attakerInstance = await Attaker.deploy(stakingInstance.address);

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
              tokenType: 4, // NATIVE
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          content: [],
          period, // 60 sec
          penalty: 5000, // 50%
          maxStake, recurrent: true,
          active: true,
        };

        // SET RULE
        const tx = stakingInstance.setRules([stakeRule]);
        await expect(tx).to.emit(stakingInstance, "RuleCreated");

        // STAKE
        // const tx1 = await stakingInstance.deposit(params, tokenIds, { value: amount });
        const tx1 = await attakerInstance.deposit(params, tokenIds, { value: amount });
        const startTimestamp: number = (await time.latest()).toNumber();
        await expect(tx1)
          .to.emit(stakingInstance, "StakingStart")
          .withArgs(1, tokenId, attakerInstance.address, startTimestamp, tokenIds);
        await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);
        // return

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
        const tx2 = await attakerInstance.receiveReward(1, false, false);
        const endTimestamp: number = (await time.latest()).toNumber();
        const balance = await erc1155Instance.balanceOf(attakerInstance.address, tokenId);

        expect(balance).to.be.equal(amount);
        await expect(tx2).to.emit(attakerInstance, "Reentered").withArgs(false);
        await expect(tx2)
          .to.emit(stakingInstance, "StakingFinish")
          .withArgs(1, attakerInstance.address, endTimestamp, 1);

        // await expect(tx2).to.changeEtherBalances([attakerInstance, stakingInstance], [amount, -amount]);
      });
    });

    describe("withdraw", function () {
      it("should not call twice (NATIVE)", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const stakingInstance = await factory();
        const erc721SimpleInstance = await erc721Factory("ERC721Simple");
        const Attaker = await ethers.getContractFactory("ReentrancyStakingReward");
        const attakerInstance = await Attaker.deploy(stakingInstance.address);

        await erc721SimpleInstance.grantRole(MINTER_ROLE, stakingInstance.address);
        await stakingInstance.grantRole(DEFAULT_ADMIN_ROLE, attakerInstance.address);

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
              amount: 0,
            },
          ],
          content: [[], [], [], []],
          period,
          penalty: 5000, // 50%
          maxStake, recurrent: true,
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
          .withArgs(1, 1, owner.address, startTimestamp, tokenIds);
        await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

        const tx2 = await stakingInstance.connect(receiver).deposit(params, tokenIds, { value: amount });
        const startTimestamp2: number = (await time.latest()).toNumber();
        await expect(tx2)
          .to.emit(stakingInstance, "StakingStart")
          .withArgs(2, 1, receiver.address, startTimestamp2, tokenIds);
        await expect(tx1).to.changeEtherBalances([owner, stakingInstance], [-amount, amount]);

        // TIME

        // REWARD

        const tx3 = await stakingInstance.receiveReward(1, true, true);
        const endTimestamp: number = (await time.latest()).toNumber();
        await expect(tx3).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);

        const stake = await stakingInstance.getStake(1);

        expect(stake).to.have.deep.nested.property("cycles", BigNumber.from(0));
        expect(stake).to.have.deep.nested.property("activeDeposit", false);

        // WITHDRAW PENALTY
        const tx4 = attakerInstance.withdrawBalance({
          tokenType: 0,
          token: constants.AddressZero,
          tokenId,
          amount,
        });

        await expect(tx4).to.changeEtherBalances([attakerInstance, stakingInstance], [amount / 2, -amount / 2]);
        await expect(tx4).to.emit(attakerInstance, "Reentered").withArgs(false);
        await expect(tx4)
          .to.emit(stakingInstance, "WithdrawBalance")
          .withArgs(attakerInstance.address, [0, constants.AddressZero, tokenId, amount / 2]);
      });

      it("should not call twice (ERC20)", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const stakingInstance = await factory();
        const erc20Instance = await erc20Factory();
        const Attaker = await ethers.getContractFactory("ReentrancyStakingReward");
        const attakerInstance = await Attaker.deploy(stakingInstance.address);

        await stakingInstance.grantRole(DEFAULT_ADMIN_ROLE, attakerInstance.address);

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
              amount: 0,
            },
          ],
          content: [],
          period,
          penalty: 5000, // 50%
          maxStake, recurrent: true,
          active: true,
        };

        // SET RULE
        const tx = stakingInstance.setRules([stakeRule]);
        await expect(tx).to.emit(stakingInstance, "RuleCreated");
        // STAKE
        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(stakingInstance.address, amount);

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(stakingInstance.address, amount);

        const tx1 = await stakingInstance.deposit(params, tokenIds);
        const startTimestamp: number = (await time.latest()).toNumber();
        await expect(tx1)
          .to.emit(stakingInstance, "StakingStart")
          .withArgs(1, 1, owner.address, startTimestamp, tokenIds);
        await expect(tx1).to.changeTokenBalances(erc20Instance, [owner, stakingInstance], [-amount, amount]);

        const tx2 = await stakingInstance.connect(receiver).deposit(params, tokenIds);
        const startTimestamp2: number = (await time.latest()).toNumber();
        await expect(tx2)
          .to.emit(stakingInstance, "StakingStart")
          .withArgs(2, 1, receiver.address, startTimestamp2, tokenIds);
        await expect(tx1).to.changeTokenBalances(erc20Instance, [owner, stakingInstance], [-amount, amount]);

        // TIME

        // REWARD

        const tx3 = await stakingInstance.receiveReward(1, true, true);
        const endTimestamp: number = (await time.latest()).toNumber();
        await expect(tx3).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);

        const stake = await stakingInstance.getStake(1);

        expect(stake).to.have.deep.nested.property("cycles", BigNumber.from(0));
        expect(stake).to.have.deep.nested.property("activeDeposit", false);

        // WITHDRAW PENALTY
        const tx4 = attakerInstance.withdrawBalance({
          tokenType: 1,
          token: erc20Instance.address,
          tokenId,
          amount,
        });

        await expect(tx4).to.changeTokenBalances(
          erc20Instance,
          [attakerInstance, stakingInstance],
          [amount / 2, -amount / 2],
        );
        await expect(tx4).to.emit(attakerInstance, "Reentered").withArgs(false);
        await expect(tx4)
          .to.emit(stakingInstance, "WithdrawBalance")
          .withArgs(attakerInstance.address, [1, erc20Instance.address, tokenId, amount / 2]);
      });

      it("should not call twice (ERC721)", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const stakingInstance = await factory();
        const erc721Instance = await erc721Factory("ERC721Simple");
        const Attaker = await ethers.getContractFactory("ReentrancyStakingReward");
        const attakerInstance = await Attaker.deploy(stakingInstance.address);

        await erc721Instance.grantRole(MINTER_ROLE, stakingInstance.address);
        await stakingInstance.grantRole(DEFAULT_ADMIN_ROLE, attakerInstance.address);

        const stakeRule: IRule = {
          deposit: [
            {
              tokenType: 2, // ERC721
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          reward: [
            {
              tokenType: 0, // NATIVE
              token: constants.AddressZero,
              tokenId,
              amount: 0,
            },
          ],
          content: [],
          period,
          penalty: 10000, // 50%
          maxStake, recurrent: true,
          active: true,
        };

        // SET RULE
        const tx = stakingInstance.setRules([stakeRule]);
        await expect(tx).to.emit(stakingInstance, "RuleCreated");
        // STAKE
        await erc721Instance.mintCommon(owner.address, templateId);
        await erc721Instance.approve(stakingInstance.address, tokenId);

        await erc721Instance.mintCommon(receiver.address, templateId);
        await erc721Instance.connect(receiver).approve(stakingInstance.address, tokenId + 1);

        const tx1 = await stakingInstance.deposit(params, [tokenId]);
        const startTimestamp: number = (await time.latest()).toNumber();
        await expect(tx1)
          .to.emit(stakingInstance, "StakingStart")
          .withArgs(1, 1, owner.address, startTimestamp, [tokenId]);
        const balance_11 = await erc721Instance.balanceOf(owner.address);
        const balance_12 = await erc721Instance.balanceOf(stakingInstance.address);
        expect(balance_11).to.be.equal(0);
        expect(balance_12).to.be.equal(1);
        // await expect(tx1).to.changeTokenBalances(erc20Instance, [owner, stakingInstance], [-amount, amount]);

        const tx2 = await stakingInstance.connect(receiver).deposit(params, [tokenId + 1]);
        const startTimestamp2: number = (await time.latest()).toNumber();
        await expect(tx2)
          .to.emit(stakingInstance, "StakingStart")
          .withArgs(2, 1, receiver.address, startTimestamp2, [tokenId + 1]);
        const balance_21 = await erc721Instance.balanceOf(owner.address);
        const balance_22 = await erc721Instance.balanceOf(stakingInstance.address);
        expect(balance_21).to.be.equal(0);
        expect(balance_22).to.be.equal(2);
        // await expect(tx1).to.changeTokenBalances(erc20Instance, [owner, stakingInstance], [-amount, amount]);

        // TIME

        // REWARD

        const tx3 = await stakingInstance.receiveReward(1, true, true);
        const endTimestamp: number = (await time.latest()).toNumber();
        await expect(tx3).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);

        const stake = await stakingInstance.getStake(1);

        expect(stake).to.have.deep.nested.property("cycles", BigNumber.from(0));
        expect(stake).to.have.deep.nested.property("activeDeposit", false);

        // WITHDRAW PENALTY
        const tx4 = attakerInstance.withdrawBalance({
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        });

        await expect(tx4).to.emit(attakerInstance, "Reentered").withArgs(false);
        await expect(tx4)
          .to.emit(stakingInstance, "WithdrawBalance")
          .withArgs(attakerInstance.address, [2, erc721Instance.address, tokenId, 1]);
        const balance_31 = await erc721Instance.balanceOf(attakerInstance.address);
        const balance_32 = await erc721Instance.balanceOf(stakingInstance.address);
        expect(balance_31).to.be.equal(1);
        expect(balance_32).to.be.equal(1);
      });

      it("should not call twice (ERC1155)", async function () {
        const [owner, receiver] = await ethers.getSigners();

        const stakingInstance = await factory();
        const erc1155Instance = await erc1155Factory();
        const Attaker = await ethers.getContractFactory("ReentrancyStakingReward");
        const attakerInstance = await Attaker.deploy(stakingInstance.address);

        await erc1155Instance.grantRole(MINTER_ROLE, stakingInstance.address);
        await stakingInstance.grantRole(DEFAULT_ADMIN_ROLE, attakerInstance.address);

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
              amount: 0,
            },
          ],
          content: [],
          period,
          penalty: 10000, // 50%
          maxStake, recurrent: true,
          active: true,
        };

        // SET RULE
        const tx = stakingInstance.setRules([stakeRule]);
        await expect(tx).to.emit(stakingInstance, "RuleCreated");
        // STAKE
        await erc1155Instance.mint(owner.address, tokenId, amount, "0x");
        await erc1155Instance.setApprovalForAll(stakingInstance.address, true);

        await erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(receiver).setApprovalForAll(stakingInstance.address, true);

        const tx1 = await stakingInstance.deposit(params, tokenIds);
        const startTimestamp: number = (await time.latest()).toNumber();
        await expect(tx1)
          .to.emit(stakingInstance, "StakingStart")
          .withArgs(1, 1, owner.address, startTimestamp, tokenIds);
        const balance_11 = await erc1155Instance.balanceOf(owner.address, tokenId);
        const balance_12 = await erc1155Instance.balanceOf(stakingInstance.address, tokenId);
        expect(balance_11).to.be.equal(0);
        expect(balance_12).to.be.equal(amount);
        // await expect(tx1).to.changeTokenBalances(erc20Instance, [owner, stakingInstance], [-amount, amount]);

        const tx2 = await stakingInstance.connect(receiver).deposit(params, tokenIds);
        const startTimestamp2: number = (await time.latest()).toNumber();
        await expect(tx2)
          .to.emit(stakingInstance, "StakingStart")
          .withArgs(2, 1, receiver.address, startTimestamp2, tokenIds);
        const balance_21 = await erc1155Instance.balanceOf(owner.address, tokenId);
        const balance_22 = await erc1155Instance.balanceOf(stakingInstance.address, tokenId);
        expect(balance_21).to.be.equal(0);
        expect(balance_22).to.be.equal(amount * 2);
        // await expect(tx1).to.changeTokenBalances(erc20Instance, [owner, stakingInstance], [-amount, amount]);

        // TIME

        // REWARD

        const tx3 = await stakingInstance.receiveReward(1, true, true);
        const endTimestamp: number = (await time.latest()).toNumber();
        await expect(tx3).to.emit(stakingInstance, "StakingWithdraw").withArgs(1, owner.address, endTimestamp);

        const stake = await stakingInstance.getStake(1);

        expect(stake).to.have.deep.nested.property("cycles", BigNumber.from(0));
        expect(stake).to.have.deep.nested.property("activeDeposit", false);

        // WITHDRAW PENALTY
        const tx4 = attakerInstance.withdrawBalance({
          tokenType: 4,
          token: erc1155Instance.address,
          tokenId,
          amount,
        });

        await expect(tx4).to.emit(attakerInstance, "Reentered").withArgs(false);
        await expect(tx4)
          .to.emit(stakingInstance, "WithdrawBalance")
          .withArgs(attakerInstance.address, [4, erc1155Instance.address, tokenId, amount]);
        const balance_31 = await erc1155Instance.balanceOf(attakerInstance.address, tokenId);
        const balance_32 = await erc1155Instance.balanceOf(stakingInstance.address, tokenId);
        expect(balance_31).to.be.equal(amount);
        expect(balance_32).to.be.equal(amount);
      });
    });
  });
}

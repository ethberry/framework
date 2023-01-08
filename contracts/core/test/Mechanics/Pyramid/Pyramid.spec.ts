import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers, waffle, web3 } from "hardhat";
import { constants, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { tokenZero } from "../../constants";
import { IRule } from "./interface/staking";
import { deployPyramid } from "./fixture";
import { deployERC20 } from "../../ERC20/shared/fixtures";

use(solidity);

describe("Pyramid", function () {
  const period = 300;
  const penalty = 0;
  const cycles = 2;

  const erc20Factory = () => deployERC20("ERC20Simple", { amount: utils.parseEther("1000000000") });

  const refProgram = {
    maxRefs: 10,
    refReward: 10 * 100, // 10.00 %
    refDecrease: 10, // 10% - 1% - 0.1% - 0.01% etc.
  };

  describe("setRule", function () {
    it("should fail edit when Rule not exist", async function () {
      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      const tx1 = pyramidInstance.updateRule(2, false);
      await expect(tx1).to.be.revertedWith("Pyramid: rule does not exist");
    });

    it("should set one Rule", async function () {
      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
    });

    it("should set multiple Rules", async function () {
      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 2,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // todo count Events?
    });

    it("should edit Rule", async function () {
      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
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
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        externalId: 1,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      const tx1 = pyramidInstance.deposit(owner.address, 2, 0, { value: 100 });
      await expect(tx1).to.be.revertedWith("Pyramid: rule doesn't exist");
    });

    it("should fail for not active rule", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: false,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      const tx1 = pyramidInstance.deposit(owner.address, 1, 0, { value: 100 });
      await expect(tx1).to.be.revertedWith("Pyramid: rule doesn't active");
    });

    it("should fail for wrong pay amount", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      const tx1 = pyramidInstance.deposit(owner.address, 1, 0, { value: 100 });
      await expect(tx1).to.be.revertedWith("Pyramid: wrong amount");
    });

    it("should stake NATIVE", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      const tx1 = pyramidInstance.deposit(
        owner.address,
        1,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.tokenId,
        {
          value: {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount,
        },
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
    });

    it("should stake ERC20", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      await erc20Instance.mint(
        owner.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      let balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      await erc20Instance.approve(
        pyramidInstance.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );

      const tx1 = pyramidInstance.deposit(
        owner.address,
        1,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.tokenId,
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart").to.emit(erc20Instance, "Transfer").withArgs(
        owner.address,
        pyramidInstance.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(0);
    });
  });

  describe("Reward", function () {
    it("should fail for wrong staking id", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      const tx1 = pyramidInstance.connect(receiver).deposit(
        owner.address,
        1,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.tokenId,
        {
          value: {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount,
        },
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");

      const stakeBalance = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount,
      );
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await pyramidInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = pyramidInstance.connect(receiver).receiveReward(2, true, true);
      await expect(tx2).to.be.revertedWith("Pyramid: wrong staking id");
    });

    it("should fail for not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      const tx1 = pyramidInstance.connect(receiver).deposit(
        owner.address,
        1,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.tokenId,
        {
          value: {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount,
        },
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount,
      );
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await pyramidInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = pyramidInstance.receiveReward(1, true, true);
      await expect(tx2).to.be.revertedWith("Pyramid: not an owner");
    });

    it("should fail for withdrawn already", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      const tx1 = pyramidInstance.connect(receiver).deposit(
        owner.address,
        1,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.tokenId,
        {
          value: {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount,
        },
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount,
      );
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await pyramidInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await pyramidInstance.connect(receiver).receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(pyramidInstance, "StakingWithdraw")
        .to.emit(pyramidInstance, "StakingFinish")
        .to.changeEtherBalance(
          receiver,
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount *
            2 +
            {
              tokenType: 0, // NATIVE
              token: constants.AddressZero,
              tokenId: 0,
              amount: 1000,
            }.amount,
        );

      const tx3 = pyramidInstance.connect(receiver).receiveReward(1, true, true);
      await expect(tx3).to.be.revertedWith("Pyramid: deposit withdrawn already");
    });

    it("should stake NATIVE & receive NATIVE", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      const tx1 = pyramidInstance.deposit(
        owner.address,
        1,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.tokenId,
        {
          value: {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount,
        },
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount,
      );
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await pyramidInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await pyramidInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(pyramidInstance, "StakingWithdraw")
        .to.emit(pyramidInstance, "StakingFinish")
        .to.changeEtherBalance(
          owner,
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount *
            cycles +
            {
              tokenType: 0, // NATIVE
              token: constants.AddressZero,
              tokenId: 0,
              amount: 1000,
            }.amount,
        );
    });

    it("should stake NATIVE & receive ERC20", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      const tx1 = pyramidInstance.deposit(
        owner.address,
        1,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.tokenId,
        {
          value: {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount,
        },
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount,
      );
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await erc20Instance.mint(
        pyramidInstance.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount * cycles,
      );
      let balance = await erc20Instance.balanceOf(pyramidInstance.address);
      expect(balance).to.equal(
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount * cycles,
      );
      const tx2 = await pyramidInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(pyramidInstance, "StakingWithdraw")
        .to.emit(pyramidInstance, "StakingFinish")
        .to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount * cycles,
      );
      // DEPOSIT
      await expect(tx2).to.changeEtherBalance(
        owner,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount,
      );
    });

    it("should stake ERC20 & receive NATIVE", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(
        owner.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      let balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      await erc20Instance.approve(
        pyramidInstance.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      const tx1 = pyramidInstance.deposit(
        owner.address,
        1,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.tokenId,
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart").to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await pyramidInstance.fundEth({ value: utils.parseEther("1.0") });
      const tx2 = await pyramidInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(pyramidInstance, "StakingWithdraw")
        .to.emit(pyramidInstance, "StakingFinish")
        .to.changeEtherBalance(
          owner,
          {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount * cycles,
        );
      balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
    });

    it("should stake ERC20 & receive ERC20", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULE
      const tx = pyramidInstance.setRules([stakeRule]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");
      // STAKE
      await erc20Instance.mint(
        owner.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      let balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      await erc20Instance.approve(
        pyramidInstance.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      const tx1 = pyramidInstance.deposit(
        owner.address,
        1,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.tokenId,
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await erc20Instance.mint(
        pyramidInstance.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount * cycles,
      );
      const tx2 = await pyramidInstance.receiveReward(1, true, true);
      await expect(tx2).to.emit(pyramidInstance, "StakingWithdraw");
      await expect(tx2).to.emit(pyramidInstance, "StakingFinish");
      balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount *
          cycles +
          {
            tokenType: 1, // ERC20
            token: erc20Instance.address,
            tokenId: 0,
            amount: 100,
          }.amount,
      );
    });
  });

  describe("Finalize", function () {
    it("should fail send ETH", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();

      const tx = owner.sendTransaction({
        to: pyramidInstance.address,
        value: constants.WeiPerEther,
      });

      await expect(tx).to.be.reverted;
    });

    it("should fund ETH", async function () {
      const pyramidInstance = await deployPyramid();

      const tx = pyramidInstance.fundEth({ value: constants.WeiPerEther });
      await expect(tx).to.changeEtherBalance(pyramidInstance, constants.WeiPerEther);
    });

    it("should finalize by selfdestruct", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();

      const tx = pyramidInstance.fundEth({ value: constants.WeiPerEther });
      await expect(tx).to.changeEtherBalance(pyramidInstance, constants.WeiPerEther);

      const tx1 = pyramidInstance.finalize();
      await expect(tx1).to.changeEtherBalance(owner, constants.WeiPerEther);
    });

    it("should finalize by Rule", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // STAKE 1
      const tx1 = pyramidInstance.deposit(
        owner.address,
        1,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.tokenId,
        {
          value: {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount,
        },
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount,
      );

      // STAKE 2
      await erc20Instance.mint(
        owner.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      let balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      await erc20Instance.approve(
        pyramidInstance.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      const tx2 = pyramidInstance.deposit(
        owner.address,
        2,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.tokenId,
      );
      await expect(tx2).to.emit(pyramidInstance, "StakingStart");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(0);

      // FINALIZE 1
      const tx3 = pyramidInstance.finalizeByRuleId(1);
      await expect(tx3).to.changeEtherBalance(
        owner,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount,
      );

      // FINALIZE 2
      const tx4 = pyramidInstance.finalizeByRuleId(2);
      await expect(tx4).to.changeTokenBalance(
        erc20Instance,
        owner,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
    });

    it("should finalize by Token", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // STAKE 1
      const tx1 = pyramidInstance.deposit(
        owner.address,
        1,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.tokenId,
        {
          value: {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount,
        },
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount,
      );

      // STAKE 2
      await erc20Instance.mint(
        owner.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      let balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      await erc20Instance.approve(
        pyramidInstance.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      const tx2 = pyramidInstance.deposit(
        owner.address,
        2,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.tokenId,
      );
      await expect(tx2).to.emit(pyramidInstance, "StakingStart");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(0);

      // FINALIZE 1
      const tx3 = pyramidInstance.finalizeByToken(tokenZero);
      await expect(tx3).to.changeEtherBalance(
        owner,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount,
      );

      // FINALIZE 2
      const tx4 = pyramidInstance.finalizeByToken(erc20Instance.address);
      await expect(tx4).to.changeTokenBalance(
        erc20Instance,
        owner,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
    });

    it("should fail finalize by Rule: 0 balance", async function () {
      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // FINALIZE 1
      const tx3 = pyramidInstance.finalizeByRuleId(1);
      await expect(tx3).to.be.revertedWith("Pyramid: 0 balance");

      // FINALIZE 2
      const tx4 = pyramidInstance.finalizeByRuleId(2);
      await expect(tx4).to.be.revertedWith("Pyramid: 0 balance");
    });

    it("should fail finalize by Token: 0 balance", async function () {
      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // FINALIZE 1
      const tx3 = pyramidInstance.finalizeByToken(tokenZero);
      await expect(tx3).to.be.revertedWith("Pyramid: 0 balance");

      // FINALIZE 2
      const tx4 = pyramidInstance.finalizeByToken(erc20Instance.address);
      await expect(tx4).to.be.revertedWith("Pyramid: 0 balance");
    });
  });

  describe("Withdraw", function () {
    it("should Withdraw", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // STAKE 1
      const tx1 = pyramidInstance.deposit(
        owner.address,
        1,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.tokenId,
        {
          value: {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount,
        },
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount,
      );

      // STAKE 2
      await erc20Instance.mint(
        owner.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      let balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      await erc20Instance.approve(
        pyramidInstance.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      const tx2 = pyramidInstance.deposit(
        owner.address,
        2,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.tokenId,
      );
      await expect(tx2).to.emit(pyramidInstance, "StakingStart");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(0);

      // WITHDRAW 1
      const tx3 = pyramidInstance.withdrawToken(
        tokenZero,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount / 2,
      );
      await expect(tx3).to.changeEtherBalance(
        owner,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount / 2,
      );

      // WITHDRAW 2
      const tx4 = pyramidInstance.withdrawToken(
        erc20Instance.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount / 2,
      );
      await expect(tx4).to.changeTokenBalance(
        erc20Instance,
        owner,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount / 2,
      );
    });

    it("should fail Withdraw: balance exceeded", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // STAKE 1
      const tx1 = pyramidInstance.deposit(
        owner.address,
        1,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.tokenId,
        {
          value: {
            tokenType: 0, // NATIVE
            token: constants.AddressZero,
            tokenId: 0,
            amount: 1000,
          }.amount,
        },
      );
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance).to.equal(
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount,
      );

      // STAKE 2
      await erc20Instance.mint(
        owner.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      let balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      await erc20Instance.approve(
        pyramidInstance.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount,
      );
      const tx2 = pyramidInstance.deposit(
        owner.address,
        2,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.tokenId,
      );
      await expect(tx2).to.emit(pyramidInstance, "StakingStart");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      balance = await erc20Instance.balanceOf(owner.address);
      expect(balance).to.equal(0);

      // WITHDRAW 1
      const tx3 = pyramidInstance.withdrawToken(
        tokenZero,
        {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        }.amount * 2,
      );
      await expect(tx3).to.be.revertedWith("Pyramid: balance exceeded");

      // WITHDRAW 2
      const tx4 = pyramidInstance.withdrawToken(
        erc20Instance.address,
        {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        }.amount * 2,
      );
      await expect(tx4).to.be.revertedWith("Pyramid: balance exceeded");
    });
  });

  describe("Referral", function () {
    it("should Deposit with Reward (multi ref)", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const tx0 = pyramidInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx0)
        .to.emit(pyramidInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      const stakeRule1 = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: constants.WeiPerEther,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };

      const stakeRule2 = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
        recurrent: false,
        active: true,
      };

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // STAKE 1-1
      const tx11 = pyramidInstance.connect(owner).deposit(receiver.address, 1, stakeRule1.deposit.tokenId, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx11).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance1 = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance1).to.equal(stakeRule1.deposit.amount);
      await expect(tx11)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          owner.address,
          receiver.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );

      // STAKE 1-2
      const tx12 = pyramidInstance.connect(stranger).deposit(owner.address, 1, stakeRule1.deposit.tokenId, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx12).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance2 = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance2).to.equal(stakeRule1.deposit.amount.mul(2));
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          owner.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          receiver.address,
          1,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        );

      // STAKE 1-3
      const tx13 = pyramidInstance.connect(receiver).deposit(stranger.address, 1, stakeRule1.deposit.tokenId, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx13).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance3 = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance3).to.equal(stakeRule1.deposit.amount.mul(3));
      await expect(tx13)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          stranger.address,
          0,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 0),
        );
      await expect(tx13)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          owner.address,
          1,
          tokenZero,
          constants.WeiPerEther.div(100)
            .mul((refProgram.refReward / 100) | 0)
            .div(refProgram.refDecrease ** 1),
        );

      // WITHDRAW REF REWARD 1
      const refBalance0 = await pyramidInstance.connect(receiver).getBalance(receiver.address, tokenZero);
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
      const tx2 = pyramidInstance.connect(receiver).withdrawReward(tokenZero);
      await expect(tx2).to.emit(pyramidInstance, "ReferralWithdraw").withArgs(receiver.address, tokenZero, refBalance0);
      await expect(tx2).to.changeEtherBalance(receiver, refBalance0);

      // WITHDRAW REF REWARD 2
      const refBalance1 = await pyramidInstance.connect(owner).getBalance(owner.address, tokenZero);
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
      const tx21 = pyramidInstance.connect(owner).withdrawReward(tokenZero);
      await expect(tx21).to.emit(pyramidInstance, "ReferralWithdraw").withArgs(owner.address, tokenZero, refBalance1);
      await expect(tx21).to.changeEtherBalance(owner, refBalance1);

      // WITHDRAW REF REWARD 3
      const refBalance2 = await pyramidInstance.connect(owner).getBalance(stranger.address, tokenZero);
      expect(refBalance2).to.equal(
        constants.WeiPerEther.div(100)
          .mul((refProgram.refReward / 100) | 0)
          .div(refProgram.refDecrease ** 0),
      );
      const tx22 = pyramidInstance.connect(stranger).withdrawReward(tokenZero);
      await expect(tx22)
        .to.emit(pyramidInstance, "ReferralWithdraw")
        .withArgs(stranger.address, tokenZero, refBalance2);
      await expect(tx22).to.changeEtherBalance(stranger, refBalance2);
    });

    it("should Deposit with Auto Reward (multi ref)", async function () {
      const [owner, receiver, stranger] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const tx0 = pyramidInstance.setRefProgram(refProgram.maxRefs, refProgram.refReward, refProgram.refDecrease);
      await expect(tx0)
        .to.emit(pyramidInstance, "ReferralProgram")
        .withArgs([refProgram.refReward, refProgram.refDecrease, refProgram.maxRefs, true]);

      const stakeRule1 = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: constants.WeiPerEther,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: constants.AddressZero,
          tokenId: 0,
          amount: 1000,
        },
        content: [],
        maxCycles: 2,
        period, // 60 sec
        penalty,
        recurrent: false,
        active: true,
      };
      const stakeRule2 = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: erc20Instance.address,
          tokenId: 0,
          amount: 100,
        },
        content: [],
        maxCycles: 2,
        period,
        penalty,
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
      const tx11 = pyramidInstance.connect(owner).deposit(receiver.address, 1, stakeRule1.deposit.tokenId, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx11).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance1 = await waffle.provider.getBalance(pyramidInstance.address);

      expect(stakeBalance1).to.equal(stakeRule1.deposit.amount.sub(refReward0));
      await expect(tx11)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(owner.address, receiver.address, 0, tokenZero, refReward0);
      await expect(tx11).to.emit(pyramidInstance, "ReferralWithdraw").withArgs(receiver.address, tokenZero, refReward0);
      await expect(tx11).to.changeEtherBalance(receiver, refReward0);

      // STAKE 1-2
      const tx12 = pyramidInstance.connect(stranger).deposit(owner.address, 1, stakeRule1.deposit.tokenId, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx12).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance2 = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance2).to.equal(stakeRule1.deposit.amount.mul(2).sub(refReward0.mul(2)));
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(stranger.address, owner.address, 0, tokenZero, refReward0);
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(stranger.address, receiver.address, 1, tokenZero, refReward1);
      await expect(tx12).to.emit(pyramidInstance, "ReferralWithdraw").withArgs(owner.address, tokenZero, refReward0);
      await expect(tx12).to.changeEtherBalance(owner, refReward0);

      // STAKE 1-3
      const tx13 = pyramidInstance.connect(receiver).deposit(stranger.address, 1, stakeRule1.deposit.tokenId, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx13).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance3 = await waffle.provider.getBalance(pyramidInstance.address);
      expect(stakeBalance3).to.equal(stakeRule1.deposit.amount.mul(3).sub(refReward0.mul(3)));
      await expect(tx13)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(receiver.address, stranger.address, 0, tokenZero, refReward0);
      await expect(tx13)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(receiver.address, owner.address, 1, tokenZero, refReward1);
      await expect(tx13).to.emit(pyramidInstance, "ReferralWithdraw").withArgs(stranger.address, tokenZero, refReward0);
      await expect(tx13).to.changeEtherBalance(stranger, refReward0);

      // WITHDRAW REF REWARD 1
      const refBalance0 = await pyramidInstance.connect(receiver).getBalance(receiver.address, tokenZero);
      expect(refBalance0).to.equal(refReward1);
      const tx2 = pyramidInstance.connect(receiver).withdrawReward(tokenZero);
      await expect(tx2).to.emit(pyramidInstance, "ReferralWithdraw").withArgs(receiver.address, tokenZero, refBalance0);
      await expect(tx2).to.changeEtherBalance(receiver, refBalance0);

      // WITHDRAW REF REWARD 2
      const refBalance1 = await pyramidInstance.connect(owner).getBalance(owner.address, tokenZero);
      expect(refBalance1).to.equal(refReward1);
      const tx21 = pyramidInstance.connect(owner).withdrawReward(tokenZero);
      await expect(tx21).to.emit(pyramidInstance, "ReferralWithdraw").withArgs(owner.address, tokenZero, refBalance1);
      await expect(tx21).to.changeEtherBalance(owner, refBalance1);

      // WITHDRAW REF REWARD 3
      const refBalance2 = await pyramidInstance.connect(owner).getBalance(stranger.address, tokenZero);
      expect(refBalance2).to.equal(0);
      const tx22 = pyramidInstance.connect(stranger).withdrawReward(tokenZero);
      await expect(tx22).to.be.revertedWith("Referral: Zero balance");
    });
  });
});

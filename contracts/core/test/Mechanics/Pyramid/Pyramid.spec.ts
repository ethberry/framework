import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { parseEther, WeiPerEther, ZeroAddress } from "ethers";

import { time } from "@openzeppelin/test-helpers";
import { blockAwait } from "@gemunion/contracts-utils";

import { tokenZero } from "../../constants";
import { IRule } from "./interface/staking";
import { deployPyramid } from "./fixture";
import { deployERC1363 } from "../../ERC20/shared/fixtures";

describe("Pyramid", function () {
  const period = 300;
  const penalty = 0;
  const cycles = 2;

  const erc20Factory = () => deployERC1363("ERC20Simple", { amount: parseEther("1000000000") });

  const refProgram = {
    maxRefs: 10n,
    refReward: 10n * 100n, // 10.00 %
    refDecrease: 10n, // 10% - 1% - 0.1% - 0.01% etc.
  };

  describe("setRule", function () {
    it("should fail edit when Rule not exist", async function () {
      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
      await expect(tx1).to.be.revertedWithCustomError(pyramidInstance, "NotExist");
    });

    it("should set one Rule", async function () {
      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
      // todo count 2 Events?
    });

    it("should edit Rule", async function () {
      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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

      const tx1 = pyramidInstance.deposit(owner.address, 2, { value: 100 });
      await expect(tx1).to.be.revertedWithCustomError(pyramidInstance, "NotExist");
    });

    it("should fail for not active rule", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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

      const tx1 = pyramidInstance.deposit(owner.address, 1, { value: 100 });
      await expect(tx1).to.be.revertedWithCustomError(pyramidInstance, "NotActive");
    });

    it("should fail for wrong pay amount", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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

      const tx1 = pyramidInstance.deposit(owner.address, 1, { value: 100 });
      await expect(tx1).to.be.revertedWithCustomError(pyramidInstance, "WrongAmount");
    });

    it("should stake NATIVE", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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

      const tx1 = pyramidInstance.deposit(owner.address, 1, { value: 1000 });
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
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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

      await erc20Instance.mint(owner.address, 100);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(100);
      await erc20Instance.approve(await pyramidInstance.getAddress(), 100);

      const tx1 = pyramidInstance.deposit(owner.address, 1);
      await expect(tx1)
        .to.emit(pyramidInstance, "StakingStart")
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, await pyramidInstance.getAddress(), 100);
      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
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
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
      // function deposit(address referrer, uint256 ruleId, uint256 tokenId) public payable whenNotPaused {

      const tx1 = pyramidInstance.connect(receiver).deposit(owner.address, 1, {
        value: 1000,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");

      const stakeBalance = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance).to.equal(1000);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await pyramidInstance.topUp(
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId: 0,
            amount: parseEther("1.0"),
          },
        ],
        { value: parseEther("1.0") },
      );
      await pyramidInstance.topUp(
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId: 0,
            amount: parseEther("1.0"),
          },
        ],
        { value: parseEther("1.0") },
      );
      const tx2 = pyramidInstance.connect(receiver).receiveReward(2, true, true);
      await expect(tx2).to.be.revertedWithCustomError(pyramidInstance, "WrongStake");
    });

    it("should fail for not an owner", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
      const tx1 = pyramidInstance.connect(receiver).deposit(owner.address, 1, {
        value: 1000,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance).to.equal(1000);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await pyramidInstance.topUp(
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId: 0,
            amount: parseEther("1.0"),
          },
        ],
        { value: parseEther("1.0") },
      );
      const tx2 = pyramidInstance.receiveReward(1, true, true);
      await expect(tx2).to.be.revertedWithCustomError(pyramidInstance, "NotAnOwner");
    });

    it("should fail for withdrawn already", async function () {
      const [owner, receiver] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
      const tx1 = pyramidInstance.connect(receiver).deposit(owner.address, 1, {
        value: 1000,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance).to.equal(1000);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await pyramidInstance.topUp(
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId: 0,
            amount: parseEther("1.0"),
          },
        ],
        { value: parseEther("1.0") },
      );
      const tx2 = await pyramidInstance.connect(receiver).receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(pyramidInstance, "StakingWithdraw")
        .to.emit(pyramidInstance, "StakingFinish")
        .to.changeEtherBalance(
          receiver,
          {
            tokenType: 0, // NATIVE
            token: ZeroAddress,
            tokenId: 0,
            amount: 1000,
          }.amount *
            2 +
            {
              tokenType: 0, // NATIVE
              token: ZeroAddress,
              tokenId: 0,
              amount: 1000,
            }.amount,
        );

      const tx3 = pyramidInstance.connect(receiver).receiveReward(1, true, true);
      await expect(tx3).to.be.revertedWithCustomError(pyramidInstance, "Expired");
    });

    it("should stake NATIVE & receive NATIVE", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
      const tx1 = pyramidInstance.deposit(owner.address, 1, {
        value: 1000,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance).to.equal(1000);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await pyramidInstance.topUp(
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId: 0,
            amount: parseEther("1.0"),
          },
        ],
        { value: parseEther("1.0") },
      );
      const tx2 = await pyramidInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(pyramidInstance, "StakingWithdraw")
        .to.emit(pyramidInstance, "StakingFinish")
        .to.changeEtherBalance(
          owner,
          {
            tokenType: 0, // NATIVE
            token: ZeroAddress,
            tokenId: 0,
            amount: 1000,
          }.amount *
            cycles +
            {
              tokenType: 0, // NATIVE
              token: ZeroAddress,
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
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
      const tx1 = pyramidInstance.deposit(owner.address, 1, {
        value: 1000,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance).to.equal(1000);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await erc20Instance.mint(await pyramidInstance.getAddress(), 100 * cycles);
      const balance1 = await erc20Instance.balanceOf(await pyramidInstance.getAddress());
      expect(balance1).to.equal(100 * cycles);
      const tx2 = await pyramidInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(pyramidInstance, "StakingWithdraw")
        .to.emit(pyramidInstance, "StakingFinish")
        .to.emit(erc20Instance, "Transfer");
      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(100 * cycles);
      // DEPOSIT
      await expect(tx2).to.changeEtherBalance(owner, 1000);
    });

    it("should stake ERC20 & receive NATIVE", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
      await erc20Instance.mint(owner.address, 100);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(100);
      await erc20Instance.approve(await pyramidInstance.getAddress(), 100);
      const tx1 = pyramidInstance.deposit(owner.address, 1);
      await expect(tx1).to.emit(pyramidInstance, "StakingStart").to.emit(erc20Instance, "Transfer");
      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await pyramidInstance.topUp(
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId: 0,
            amount: parseEther("1.0"),
          },
        ],
        { value: parseEther("1.0") },
      );
      const tx2 = await pyramidInstance.receiveReward(1, true, true);
      await expect(tx2)
        .to.emit(pyramidInstance, "StakingWithdraw")
        .to.emit(pyramidInstance, "StakingFinish")
        .to.changeEtherBalance(
          owner,
          {
            tokenType: 0, // NATIVE
            token: ZeroAddress,
            tokenId: 0,
            amount: 1000,
          }.amount * cycles,
        );
      const balance3 = await erc20Instance.balanceOf(owner.address);
      expect(balance3).to.equal(100);
    });

    it("should stake ERC20 & receive ERC20", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
      await erc20Instance.mint(owner.address, 100);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(100);
      await erc20Instance.approve(await pyramidInstance.getAddress(), 100);
      const tx1 = pyramidInstance.deposit(owner.address, 1);
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      await expect(tx1).to.emit(erc20Instance, "Transfer");
      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);
      // TIME
      const current = await time.latestBlock();
      await time.advanceBlockTo(current.add(web3.utils.toBN(period * cycles)));
      // REWARD
      await erc20Instance.mint(await pyramidInstance.getAddress(), 100 * cycles);
      const tx2 = await pyramidInstance.receiveReward(1, true, true);
      await expect(tx2).to.emit(pyramidInstance, "StakingWithdraw");
      await expect(tx2).to.emit(pyramidInstance, "StakingFinish");
      const balance3 = await erc20Instance.balanceOf(owner.address);
      expect(balance3).to.equal(100 * cycles + 100);
    });
  });

  describe("Finalize", function () {
    it("should fail send ETH", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();

      const tx = owner.sendTransaction({
        to: await pyramidInstance.getAddress(),
        value: WeiPerEther,
      });

      await expect(tx).to.be.reverted;
    });

    it("should fund ETH", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();

      const tx = await pyramidInstance.topUp(
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId: 0,
            amount: parseEther("1.0"),
          },
        ],
        { value: parseEther("1.0") },
      );
      const lib = await ethers.getContractAt("ExchangeUtils", await pyramidInstance.getAddress(), owner);
      await expect(tx)
        .to.emit(lib, "PaymentEthReceived")
        .withArgs(await pyramidInstance.getAddress(), WeiPerEther);
    });

    it("should finalize by selfdestruct", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();

      const tx = await pyramidInstance.topUp(
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId: 0,
            amount: parseEther("1.0"),
          },
        ],
        { value: parseEther("1.0") },
      );

      await expect(tx).to.changeEtherBalance(pyramidInstance, WeiPerEther);

      const tx1 = pyramidInstance.finalize();
      await expect(tx1).to.changeEtherBalance(owner, WeiPerEther);
    });

    it("should finalize by Rule", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
      const tx1 = pyramidInstance.deposit(owner.address, 1, {
        value: 1000,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance).to.equal(1000);

      // STAKE 2
      await erc20Instance.mint(owner.address, 100);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(100);
      await erc20Instance.approve(await pyramidInstance.getAddress(), 100);
      const tx2 = pyramidInstance.deposit(owner.address, 2);
      await expect(tx2).to.emit(pyramidInstance, "StakingStart");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);

      // FINALIZE 1
      const tx3 = pyramidInstance.finalizeByRuleId(1);
      await expect(tx3).to.changeEtherBalance(owner, 1000);

      // FINALIZE 2
      const tx4 = pyramidInstance.finalizeByRuleId(2);
      await expect(tx4).to.changeTokenBalance(erc20Instance, owner, 100);
    });

    it("should finalize by Token", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
      const tx1 = pyramidInstance.deposit(owner.address, 1, {
        value: 1000,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance).to.equal(1000);

      // STAKE 2
      await erc20Instance.mint(owner.address, 100);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(100);
      await erc20Instance.approve(await pyramidInstance.getAddress(), 100);
      const tx2 = pyramidInstance.deposit(owner.address, 2);
      await expect(tx2).to.emit(pyramidInstance, "StakingStart");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);

      // FINALIZE 1
      const tx3 = pyramidInstance.finalizeByToken(tokenZero);
      await expect(tx3).to.changeEtherBalance(owner, 1000);

      // FINALIZE 2
      const tx4 = pyramidInstance.finalizeByToken(await erc20Instance.getAddress());
      await expect(tx4).to.changeTokenBalance(erc20Instance, owner, 100);
    });

    it("should fail finalize by Rule: 0 balance", async function () {
      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
      await expect(tx3).to.be.revertedWithCustomError(pyramidInstance, "ZeroBalance");

      // FINALIZE 2
      const tx4 = pyramidInstance.finalizeByRuleId(2);
      await expect(tx4).to.be.revertedWithCustomError(pyramidInstance, "ZeroBalance");
    });

    it("should fail finalize by Token: 0 balance", async function () {
      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
      await expect(tx3).to.be.revertedWithCustomError(pyramidInstance, "ZeroBalance");

      // FINALIZE 2
      const tx4 = pyramidInstance.finalizeByToken(await erc20Instance.getAddress());
      await expect(tx4).to.be.revertedWithCustomError(pyramidInstance, "ZeroBalance");
    });
  });

  describe("Withdraw", function () {
    it("should Fund and Withdraw ETH", async function () {
      const pyramidInstance = await deployPyramid();

      const amnt = parseEther("99.0");
      const amnt1 = parseEther("9.0");
      await pyramidInstance.topUp(
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId: 0,
            amount: parseEther("99.0"),
          },
        ],
        { value: amnt },
      );

      await blockAwait();
      // WITHDRAW ETH
      const estimateGas: bigint = await pyramidInstance.withdrawToken.estimateGas(tokenZero, amnt1);
      const tx3 = pyramidInstance.withdrawToken(tokenZero, amnt1, {
        gasLimit: estimateGas + (estimateGas / 100n) * 10n,
      });
      await expect(tx3).to.emit(pyramidInstance, "WithdrawToken").withArgs(ZeroAddress, amnt1);
    });

    it("should Withdraw after Deposit", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
      const tx1 = pyramidInstance.deposit(owner.address, 1, {
        value: 1000,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance).to.equal(1000);

      // STAKE 2
      await erc20Instance.mint(owner.address, 100);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(100);
      await erc20Instance.approve(await pyramidInstance.getAddress(), 100);
      const tx2 = pyramidInstance.deposit(owner.address, 2);
      await expect(tx2).to.emit(pyramidInstance, "StakingStart");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);

      // WITHDRAW 1
      const tx3 = pyramidInstance.withdrawToken(
        tokenZero,
        {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        }.amount / 2,
      );
      await expect(tx3).to.changeEtherBalance(
        owner,
        {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        }.amount / 2,
      );

      // WITHDRAW 2
      const tx4 = pyramidInstance.withdrawToken(await erc20Instance.getAddress(), 100 / 2);
      await expect(tx4).to.changeTokenBalance(erc20Instance, owner, 100 / 2);
    });

    it("should fail Withdraw: balance exceeded", async function () {
      const [owner] = await ethers.getSigners();

      const pyramidInstance = await deployPyramid();
      const erc20Instance = await erc20Factory();

      const stakeRule1: IRule = {
        externalId: 1,
        deposit: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
      const tx1 = pyramidInstance.deposit(owner.address, 1, {
        value: 1000,
      });
      await expect(tx1).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance).to.equal(1000);

      // STAKE 2
      await erc20Instance.mint(owner.address, 100);
      const balance1 = await erc20Instance.balanceOf(owner.address);
      expect(balance1).to.equal(100);
      await erc20Instance.approve(await pyramidInstance.getAddress(), 100);
      const tx2 = pyramidInstance.deposit(owner.address, 2);
      await expect(tx2).to.emit(pyramidInstance, "StakingStart");
      await expect(tx2).to.emit(erc20Instance, "Transfer");
      const balance2 = await erc20Instance.balanceOf(owner.address);
      expect(balance2).to.equal(0);

      // WITHDRAW 1
      const tx3 = pyramidInstance.withdrawToken(
        tokenZero,
        {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
          tokenId: 0,
          amount: 1000,
        }.amount * 2,
      );
      await expect(tx3).to.be.revertedWithCustomError(pyramidInstance, "BalanceExceed");

      // WITHDRAW 2
      const tx4 = pyramidInstance.withdrawToken(await erc20Instance.getAddress(), 100 * 2);
      await expect(tx4).to.be.revertedWithCustomError(pyramidInstance, "BalanceExceed");
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
          token: ZeroAddress,
          tokenId: 0,
          amount: WeiPerEther,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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
      const tx11 = pyramidInstance.connect(owner).deposit(receiver.address, 1, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx11).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance1 = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance1).to.equal(stakeRule1.deposit.amount);
      await expect(tx11)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          owner.address,
          receiver.address,
          0,
          tokenZero,
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );

      // STAKE 1-2
      const tx12 = pyramidInstance.connect(stranger).deposit(owner.address, 1, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx12).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance2 = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance2).to.equal(stakeRule1.deposit.amount * 2n);
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          owner.address,
          0,
          tokenZero,
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          stranger.address,
          receiver.address,
          1,
          tokenZero,
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 1n,
        );

      // STAKE 1-3
      const tx13 = pyramidInstance.connect(receiver).deposit(stranger.address, 1, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx13).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance3 = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance3).to.equal(stakeRule1.deposit.amount * 3n);
      await expect(tx13)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          stranger.address,
          0,
          tokenZero,
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
        );
      await expect(tx13)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(
          receiver.address,
          owner.address,
          1,
          tokenZero,
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 1n,
        );

      // WITHDRAW REF REWARD 1
      const refBalance0 = await pyramidInstance.connect(receiver).getBalance(receiver.address, tokenZero);
      expect(refBalance0).to.equal(
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n +
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 1n,
      );
      const tx2 = pyramidInstance.connect(receiver).withdrawReward(tokenZero);
      await expect(tx2).to.emit(pyramidInstance, "ReferralWithdraw").withArgs(receiver.address, tokenZero, refBalance0);
      await expect(tx2).to.changeEtherBalance(receiver, refBalance0);

      // WITHDRAW REF REWARD 2
      const refBalance1 = await pyramidInstance.connect(owner).getBalance(owner.address, tokenZero);
      expect(refBalance1).to.equal(
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n +
          ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 1n,
      );
      const tx21 = pyramidInstance.connect(owner).withdrawReward(tokenZero);
      await expect(tx21).to.emit(pyramidInstance, "ReferralWithdraw").withArgs(owner.address, tokenZero, refBalance1);
      await expect(tx21).to.changeEtherBalance(owner, refBalance1);

      // WITHDRAW REF REWARD 3
      const refBalance2 = await pyramidInstance.connect(owner).getBalance(stranger.address, tokenZero);
      expect(refBalance2).to.equal(
        ((WeiPerEther / 100n) * ((refProgram.refReward / 100n) | 0n)) / refProgram.refDecrease ** 0n,
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
          token: ZeroAddress,
          tokenId: 0,
          amount: WeiPerEther,
        },
        reward: {
          tokenType: 0, // NATIVE
          token: ZeroAddress,
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
          token: await erc20Instance.getAddress(),
          tokenId: 0,
          amount: 100,
        },
        reward: {
          tokenType: 1, // ERC20
          token: await erc20Instance.getAddress(),
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

      const refReward0 =
        ((WeiPerEther / 100n) * // level 0
          ((refProgram.refReward / 100n) | 0n)) /
        refProgram.refDecrease ** 0n;

      const refReward1 =
        ((WeiPerEther / 100n) * // level 1
          ((refProgram.refReward / 100n) | 0n)) /
        refProgram.refDecrease ** 1n;

      // SET RULES
      const tx = pyramidInstance.setRules([stakeRule1, stakeRule2]);
      await expect(tx).to.emit(pyramidInstance, "RuleCreated");

      // SET AUTO REWARD
      await pyramidInstance.setAutoWithdrawal(true);

      // STAKE 1-1
      const tx11 = pyramidInstance.connect(owner).deposit(receiver.address, 1, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx11).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance1 = await ethers.provider.getBalance(await pyramidInstance.getAddress());

      expect(stakeBalance1).to.equal(stakeRule1.deposit.amount - refReward0);
      await expect(tx11)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(owner.address, receiver.address, 0, tokenZero, refReward0);
      await expect(tx11).to.emit(pyramidInstance, "ReferralWithdraw").withArgs(receiver.address, tokenZero, refReward0);
      await expect(tx11).to.changeEtherBalance(receiver, refReward0);

      // STAKE 1-2
      const tx12 = pyramidInstance.connect(stranger).deposit(owner.address, 1, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx12).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance2 = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance2).to.equal(stakeRule1.deposit.amount * 2n - refReward0 * 2n);
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(stranger.address, owner.address, 0, tokenZero, refReward0);
      await expect(tx12)
        .to.emit(pyramidInstance, "ReferralReward")
        .withArgs(stranger.address, receiver.address, 1, tokenZero, refReward1);
      await expect(tx12).to.emit(pyramidInstance, "ReferralWithdraw").withArgs(owner.address, tokenZero, refReward0);
      await expect(tx12).to.changeEtherBalance(owner, refReward0);

      // STAKE 1-3
      const tx13 = pyramidInstance.connect(receiver).deposit(stranger.address, 1, {
        value: stakeRule1.deposit.amount,
      });
      await expect(tx13).to.emit(pyramidInstance, "StakingStart");
      const stakeBalance3 = await ethers.provider.getBalance(await pyramidInstance.getAddress());
      expect(stakeBalance3).to.equal(stakeRule1.deposit.amount * 3n - refReward0 * 3n);
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

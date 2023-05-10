import { expect } from "chai";
import { ethers, web3 } from "hardhat";
import { constants, Contract, utils } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { amount, MINTER_ROLE, nonce } from "@gemunion/contracts-constants";

import { expiresAt, extra, tokenId, tokenIds } from "../../../constants";
import { IRule } from "../interface/staking";
import { deployERC20 } from "../../../ERC20/shared/fixtures";
import { deployERC721 } from "../../../ERC721/shared/fixtures";
import { deployERC1155 } from "../../../ERC1155/shared/fixtures";

export function shouldHaveReentrancyGuard(factory: () => Promise<Contract>) {
  const period = 300;
  const cycles = 2;
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

  describe("Reentrance Guard: REWARD", function () {
    it("should not call receiveReward twice (NATIVE)", async function () {
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
        recurrent: true,
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
      await expect(tx2).to.emit(stakingInstance, "StakingFinish").withArgs(1, attakerInstance.address, endTimestamp, 1);
    });

    it("should not call receiveReward twice (ERC20)", async function () {
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
        recurrent: true,
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
      await expect(tx2).to.emit(stakingInstance, "StakingFinish").withArgs(1, attakerInstance.address, endTimestamp, 1);
    });

    it("should not call receiveReward twice (ERC721)", async function () {
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
        recurrent: true,
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
      await expect(tx2).to.emit(stakingInstance, "StakingFinish").withArgs(1, attakerInstance.address, endTimestamp, 1);

      // await expect(tx2).to.changeEtherBalances([attakerInstance, stakingInstance], [amount, -amount]);
    });

    it("should not call receiveReward twice (ERC1155)", async function () {
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
        recurrent: true,
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
      await expect(tx2).to.emit(stakingInstance, "StakingFinish").withArgs(1, attakerInstance.address, endTimestamp, 1);

      // await expect(tx2).to.changeEtherBalances([attakerInstance, stakingInstance], [amount, -amount]);
    });
  });
}

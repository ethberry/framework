import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { time } from "@openzeppelin/test-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Coin, ContractManager } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, tokenName, tokenSymbol } from "../constants";

describe("ContractManager", function () {
  let erc20: ContractFactory;
  let erc20Instance: Coin;
  let manager: ContractFactory;
  let managerInstance: ContractManager;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("Coin");
    manager = await ethers.getContractFactory("ContractManager");
    [owner, receiver] = await ethers.getSigners();

    erc20Instance = (await erc20.deploy(tokenName, tokenSymbol, amount)) as Coin;
    managerInstance = (await manager.deploy()) as ContractManager;

    await erc20Instance.mint(owner.address, amount);
    await erc20Instance.approve(managerInstance.address, amount);
  });

  describe("constructor", function () {
    it("should set the right roles to deployer", async function () {
      const isAdmin = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
    });
  });

  describe("createVesting", function () {
    it("should create vesting (FLAT + ETH)", async function () {
      const span = 300;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = await managerInstance.createVesting(
        "FLAT",
        ethers.constants.AddressZero,
        0,
        receiver.address,
        timestamp,
        span,
        { value: amount },
      );

      const [vesting] = await managerInstance.allVesting();

      await expect(tx)
        .to.emit(managerInstance, "VestingDeployed")
        .withArgs(vesting, "FLAT", ethers.constants.AddressZero, amount, receiver.address, timestamp, span);
    });

    it("should create vesting (FLAT + ERC20)", async function () {
      const span = 300;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = await managerInstance.createVesting(
        "FLAT",
        erc20Instance.address,
        amount,
        receiver.address,
        timestamp,
        span,
      );

      const [vesting] = await managerInstance.allVesting();

      await expect(tx)
        .to.emit(managerInstance, "VestingDeployed")
        .withArgs(vesting, "FLAT", erc20Instance.address, amount, receiver.address, timestamp, span);
    });

    it("should fail: amount must be greater than 0 (FLAT + ETH)", async function () {
      const span = 300;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = managerInstance.createVesting(
        "FLAT",
        ethers.constants.AddressZero,
        0,
        receiver.address,
        timestamp,
        span,
        { value: 0 },
      );

      await expect(tx).to.be.revertedWith("ContractManager: vesting amount must be greater than zero");
    });

    it("should fail: amount must be greater than 0 (FLAT + ERC20)", async function () {
      const span = 300;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = managerInstance.createVesting("FLAT", erc20Instance.address, 0, receiver.address, timestamp, span);

      await expect(tx).to.be.revertedWith("ContractManager: vesting amount must be greater than zero");
    });

    it("should fail: unknown template", async function () {
      const span = 300;
      const timestamp: number = (await time.latest()).toNumber();

      const tx = managerInstance.createVesting(
        "UNKNOWN",
        erc20Instance.address,
        amount,
        receiver.address,
        timestamp,
        span,
      );

      await expect(tx).to.be.revertedWith("ContractManager: unknown template");
    });
  });
});

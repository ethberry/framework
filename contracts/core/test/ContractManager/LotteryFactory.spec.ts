import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, nonce } from "@gemunion/contracts-constants";
import { deployContract } from "@gemunion/contracts-mocks";

import { getContractName, isEqualArray } from "../utils";

describe("LotteryFactory", function () {
  const factory = () => deployContract(this.title);

  describe("deployLottery", function () {
    it("should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const lottery = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));

      const contractInstance = await factory();
      const verifyingContract = await contractInstance.getAddress();

      const signature = await owner.signTypedData(
        // Domain
        {
          name: "ContractManager",
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract,
        },
        // Types
        {
          EIP712: [
            { name: "params", type: "Params" },
            { name: "args", type: "LotteryArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
          LotteryArgs: [{ name: "config", type: "LotteryConfig" }],
          LotteryConfig: [
            { name: "timeLagBeforeRelease", type: "uint256" },
            { name: "commission", type: "uint256" },
          ],
        },
        // Values
        {
          params: {
            nonce,
            bytecode: lottery.bytecode,
          },
          args: {
            config: {
              timeLagBeforeRelease: 100,
              commission: 30,
            },
          },
        },
      );

      const tx = await contractInstance.deployLottery(
        {
          nonce,
          bytecode: lottery.bytecode,
        },
        {
          config: {
            timeLagBeforeRelease: 100,
            commission: 30,
          },
        },
        signature,
      );

      const [address] = await contractInstance.allLotterys();

      await expect(tx)
        .to.emit(contractInstance, "LotteryDeployed")
        .withArgs(address, isEqualArray(["100", "30"]));
    });

    it("should fail: SignerMissingRole", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const lottery = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));

      const contractInstance = await factory();
      const verifyingContract = await contractInstance.getAddress();

      const signature = await owner.signTypedData(
        // Domain
        {
          name: "ContractManager",
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract,
        },
        // Types
        {
          EIP712: [
            { name: "params", type: "Params" },
            { name: "args", type: "LotteryArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
          LotteryArgs: [{ name: "config", type: "LotteryConfig" }],
          LotteryConfig: [
            { name: "timeLagBeforeRelease", type: "uint256" },
            { name: "commission", type: "uint256" },
          ],
        },
        // Values
        {
          params: {
            nonce,
            bytecode: lottery.bytecode,
          },
          args: {
            config: {
              timeLagBeforeRelease: 100,
              commission: 30,
            },
          },
        },
      );

      await contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, owner.address);

      const tx = contractInstance.deployLottery(
        {
          nonce,
          bytecode: lottery.bytecode,
        },
        {
          config: {
            timeLagBeforeRelease: 100,
            commission: 30,
          },
        },
        signature,
      );

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "SignerMissingRole");
    });
  });
});

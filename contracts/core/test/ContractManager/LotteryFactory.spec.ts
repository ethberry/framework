import { expect } from "chai";
import { ethers } from "hardhat";
import { getAddress } from "ethers";

import { DEFAULT_ADMIN_ROLE, nonce } from "@gemunion/contracts-constants";
import { deployContract } from "@gemunion/contracts-mocks";

import { buildBytecode, buildCreate2Address, getContractName, isEqualArray, recursivelyDecodeResult } from "../utils";
import { externalId } from "../constants";

describe("LotteryFactory", function () {
  const factory = () => deployContract(this.title);

  describe("deployLottery", function () {
    it("should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));

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
            { name: "externalId", type: "uint256" },
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
            bytecode,
            externalId,
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
          bytecode,
          externalId,
        },
        {
          config: {
            timeLagBeforeRelease: 100,
            commission: 30,
          },
        },
        signature,
      );

      const buildByteCode = buildBytecode(["uint256", "uint256"], [100, 30], bytecode);
      const address = getAddress(buildCreate2Address(await contractInstance.getAddress(), nonce, buildByteCode));

      await expect(tx)
        .to.emit(contractInstance, "LotteryDeployed")
        .withArgs(address, externalId, isEqualArray(["100", "30"]));

      const lotteryInstance = await ethers.getContractAt(getContractName("LotteryRandom", network.name), address);

      const lotteryConfig = await lotteryInstance.getLotteryInfo();
      expect(recursivelyDecodeResult(lotteryConfig)).deep.include({
        timeLagBeforeRelease: 100n,
        commission: 30n,
      });
    });

    it("should fail: SignerMissingRole", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory(getContractName("LotteryRandom", network.name));

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
            { name: "externalId", type: "uint256" },
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
            bytecode,
            externalId,
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
          bytecode,
          externalId,
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

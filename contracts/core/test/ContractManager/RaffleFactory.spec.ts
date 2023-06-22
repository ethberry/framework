import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, nonce } from "@gemunion/contracts-constants";
import { deployContract } from "@gemunion/contracts-mocks";

import { getContractName, isEqualArray } from "../utils";
import { externalId } from "../constants";

describe("RaffleFactory", function () {
  const factory = () => deployContract(this.title);

  describe("deployRaffle", function () {
    it("should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));

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
            { name: "args", type: "RaffleArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "externalId", type: "uint256" },
          ],
          RaffleArgs: [{ name: "config", type: "RaffleConfig" }],
          RaffleConfig: [
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

      const tx = await contractInstance.deployRaffle(
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

      const [address] = await contractInstance.allRaffles();

      await expect(tx)
        .to.emit(contractInstance, "RaffleDeployed")
        .withArgs(address, externalId, isEqualArray(["100", "30"]));
    });

    it("should fail: SignerMissingRole", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory(getContractName("RaffleRandom", network.name));

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
            { name: "args", type: "RaffleArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "externalId", type: "uint256" },
          ],
          RaffleArgs: [{ name: "config", type: "RaffleConfig" }],
          RaffleConfig: [
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

      const tx = contractInstance.deployRaffle(
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
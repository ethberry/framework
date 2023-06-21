import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@openzeppelin/test-helpers";

import { DEFAULT_ADMIN_ROLE, nonce } from "@gemunion/contracts-constants";
import { deployContract } from "@gemunion/contracts-mocks";

import { isEqualEventArgObj } from "../utils";
import { externalId } from "../constants";

describe("VestingFactory", function () {
  const factory = () => deployContract(this.title);

  describe("deployVesting", function () {
    it("should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory("Vesting");

      const contractInstance = await factory();
      const verifyingContract = await contractInstance.getAddress();

      const current = await time.latest();
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
            { name: "args", type: "VestingArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "externalId", type: "uint256" },
          ],
          VestingArgs: [
            { name: "beneficiary", type: "address" },
            { name: "startTimestamp", type: "uint64" },
            { name: "cliffInMonth", type: "uint16" },
            { name: "monthlyRelease", type: "uint16" },
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
            beneficiary: owner.address,
            startTimestamp: current.toNumber(),
            cliffInMonth: 12,
            monthlyRelease: 417,
          },
        },
      );

      const tx = await contractInstance.deployVesting(
        {
          nonce,
          bytecode,
          externalId,
        },
        {
          beneficiary: owner.address,
          startTimestamp: current.toNumber(),
          cliffInMonth: 12,
          monthlyRelease: 417,
        },
        signature,
      );

      const [address] = await contractInstance.allVesting();

      await expect(tx)
        .to.emit(contractInstance, "VestingDeployed")
        .withArgs(
          address,
          externalId,
          isEqualEventArgObj({
            beneficiary: owner.address,
            startTimestamp: current.toString(),
            cliffInMonth: "12",
            monthlyRelease: "417",
          }),
        );
    });

    it("should fail: SignerMissingRole", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory("Vesting");

      const contractInstance = await factory();
      const verifyingContract = await contractInstance.getAddress();

      const current = await time.latest();
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
            { name: "args", type: "VestingArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "externalId", type: "uint256" },
          ],
          VestingArgs: [
            { name: "beneficiary", type: "address" },
            { name: "startTimestamp", type: "uint64" },
            { name: "cliffInMonth", type: "uint16" },
            { name: "monthlyRelease", type: "uint16" },
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
            beneficiary: owner.address,
            startTimestamp: current.toNumber(),
            cliffInMonth: 12,
            monthlyRelease: 417,
          },
        },
      );

      await contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, owner.address);

      const tx = contractInstance.deployVesting(
        {
          nonce,
          bytecode,
          externalId,
        },
        {
          beneficiary: owner.address,
          startTimestamp: current.toNumber(),
          cliffInMonth: 12,
          monthlyRelease: 417,
        },
        signature,
      );

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "SignerMissingRole");
    });
  });
});

import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, nonce } from "@gemunion/contracts-constants";
import { deployContract } from "@gemunion/contracts-mocks";

import { contractTemplate, externalId } from "../constants";
import { isEqualArray } from "../utils";

describe("PyramidFactory", function () {
  const factory = () => deployContract(this.title);

  describe("deployPyramid", function () {
    it("should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory("Pyramid");

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
            { name: "args", type: "PyramidArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "externalId", type: "uint256" },
          ],
          PyramidArgs: [
            { name: "payees", type: "address[]" },
            { name: "shares", type: "uint256[]" },
            { name: "contractTemplate", type: "string" },
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
            payees: [owner.address],
            shares: [1],
            contractTemplate,
          },
        },
      );

      const tx = await contractInstance.deployPyramid(
        {
          nonce,
          bytecode,
          externalId,
        },
        {
          payees: [owner.address],
          shares: [1],
          contractTemplate,
        },
        signature,
      );

      const [address] = await contractInstance.allPyramids();

      await expect(tx)
        .to.emit(contractInstance, "PyramidDeployed")
        .withArgs(address, externalId, isEqualArray([owner.address], [1n], contractTemplate));
    });

    it("should fail: SignerMissingRole", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory("Pyramid");

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
            { name: "args", type: "PyramidArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "externalId", type: "uint256" },
          ],
          PyramidArgs: [
            { name: "payees", type: "address[]" },
            { name: "shares", type: "uint256[]" },
            { name: "contractTemplate", type: "string" },
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
            payees: [owner.address],
            shares: [1],
            contractTemplate,
          },
        },
      );

      await contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, owner.address);

      const tx = contractInstance.deployPyramid(
        {
          nonce,
          bytecode,
          externalId,
        },
        {
          payees: [owner.address],
          shares: [1],
          contractTemplate,
        },
        signature,
      );

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "SignerMissingRole");
    });
  });
});

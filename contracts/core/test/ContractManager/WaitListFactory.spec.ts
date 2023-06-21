import { expect } from "chai";
import { ethers } from "hardhat";

import { DEFAULT_ADMIN_ROLE, nonce } from "@gemunion/contracts-constants";
import { deployContract } from "@gemunion/contracts-mocks";

describe("WaitListFactory", function () {
  const factory = () => deployContract(this.title);

  describe("deployWaitList", function () {
    it("should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const waitList = await ethers.getContractFactory("WaitList");

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
          EIP712: [{ name: "params", type: "Params" }],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
        },
        // Values
        {
          params: {
            nonce,
            bytecode: waitList.bytecode,
          },
        },
      );

      const tx = await contractInstance.deployWaitList(
        {
          nonce,
          bytecode: waitList.bytecode,
        },
        signature,
      );

      const [address] = await contractInstance.allWaitLists();

      await expect(tx).to.emit(contractInstance, "WaitListDeployed").withArgs(address);
    });

    it("should fail: SignerMissingRole", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const waitList = await ethers.getContractFactory("WaitList");

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
          EIP712: [{ name: "params", type: "Params" }],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
        },
        // Values
        {
          params: {
            nonce,
            bytecode: waitList.bytecode,
          },
        },
      );

      await contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, owner.address);

      const tx = contractInstance.deployWaitList(
        {
          nonce,
          bytecode: waitList.bytecode,
        },
        signature,
      );

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "SignerMissingRole");
    });
  });
});

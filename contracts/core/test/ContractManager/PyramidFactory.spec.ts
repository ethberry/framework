import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import { nonce } from "@gemunion/contracts-constants";

import { deployContractManager } from "./fixture";
import { contractTemplate } from "../constants";

describe("PyramidFactory", function () {
  const factory = () => deployContractManager(this.title);

  describe("deployPyramid", function () {
    it("should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const pyramid = await ethers.getContractFactory("Pyramid");

      const contractInstance = await factory();

      const signature = await owner._signTypedData(
        // Domain
        {
          name: "ContractManager",
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
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
            bytecode: pyramid.bytecode,
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
          bytecode: pyramid.bytecode,
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
        .withNamedArgs({
          addr: address,
          args: {
            payees: [owner.address],
            shares: [BigNumber.from(1)],
            contractTemplate,
          },
        });
    });
  });
});

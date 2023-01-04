import { expect } from "chai";
import { ethers } from "hardhat";

import { nonce } from "@gemunion/contracts-constants";

import { deployContractManager } from "./fixture";

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
          PyramidArgs: [{ name: "featureIds", type: "uint8[]" }],
        },
        // Values
        {
          params: {
            nonce,
            bytecode: pyramid.bytecode,
          },
          args: {
            featureIds: [],
          },
        },
      );

      const tx = await contractInstance.deployPyramid(
        {
          nonce,
          bytecode: pyramid.bytecode,
        },
        {
          featureIds: [],
        },
        signature,
      );

      const [address] = await contractInstance.allPyramids();

      await expect(tx).to.emit(contractInstance, "PyramidDeployed").withArgs(address, []);
    });
  });
});

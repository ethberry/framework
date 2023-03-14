import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

import { nonce } from "@gemunion/contracts-constants";

import { contractTemplate, maxStake } from "../constants";
import { deployContractManager } from "./fixture";

describe("StakingFactory", function () {
  const factory = () => deployContractManager(this.title);

  describe("deployStaking", function () {
    it("should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const staking = await ethers.getContractFactory("Staking");

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
            { name: "args", type: "StakingArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
          StakingArgs: [
            { name: "maxStake", type: "uint256" },
            { name: "contractTemplate", type: "string" },
          ],
        },
        // Values
        {
          params: {
            nonce,
            bytecode: staking.bytecode,
          },
          args: {
            maxStake,
            contractTemplate,
          },
        },
      );

      const tx = await contractInstance.deployStaking(
        {
          nonce,
          bytecode: staking.bytecode,
        },
        {
          maxStake,
          contractTemplate,
        },
        signature,
      );

      const [address] = await contractInstance.allStaking();

      await expect(tx)
        .to.emit(contractInstance, "StakingDeployed")
        .withNamedArgs({
          addr: address,
          args: {
            maxStake: BigNumber.from(maxStake),
            contractTemplate,
          },
        });
    });
  });
});

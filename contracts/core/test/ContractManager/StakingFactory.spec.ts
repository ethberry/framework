import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, nonce } from "@gemunion/contracts-constants";

import { maxStake } from "../constants";
import { deployContractManager } from "./fixture";

describe("StakingFactory", function () {
  const factory = () => deployContractManager(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);

  describe("deployStaking", function () {
    it("should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const staking = await ethers.getContractFactory("Staking");

      const contractInstance = await factory();

      // "Staking(bytes bytecode,uint256 maxStake,uint8[] featureIds,bytes32 nonce)";
      const s = {
        bytecode: staking.bytecode,
        maxStake,
        featureIds: [],
        nonce,
      };

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
          EIP712: [{ name: "s", type: "Staking" }],
          Staking: [
            { name: "bytecode", type: "bytes" },
            { name: "maxStake", type: "uint256" },
            { name: "featureIds", type: "uint8[]" },
            { name: "nonce", type: "bytes32" },
          ],
        },
        // Values
        { s },
      );
      const signer = owner.address;
      const bytecode = staking.bytecode;
      const tx = await contractInstance.deployStaking(
        {
          signer,
          signature,
        },
        {
          bytecode,
          maxStake,
          featureIds: [],
          nonce,
        },
      );

      const [address] = await contractInstance.allStaking();

      await expect(tx).to.emit(contractInstance, "StakingDeployed").withArgs(address, maxStake, []);
    });
  });
});

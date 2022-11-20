import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@openzeppelin/test-helpers";

import { shouldBeAccessible } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, nonce } from "@gemunion/contracts-constants";

import { templateId, span } from "../constants";
import { deployContractManager } from "./fixture";

describe("VestingFactory", function () {
  const factory = () => deployContractManager(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE);

  describe("deployVesting", function () {
    it("should deploy contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const vesting = await ethers.getContractFactory("CliffVesting");

      const contractInstance = await factory();

      const timestamp: number = (await time.latest()).toNumber();

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
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "account", type: "address" },
            { name: "startTimestamp", type: "uint64" },
            { name: "duration", type: "uint64" },
            { name: "templateId", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          bytecode: vesting.bytecode,
          account: receiver.address,
          startTimestamp: timestamp,
          duration: span,
          templateId,
        },
      );

      const tx = await contractInstance.deployVesting(
        nonce,
        vesting.bytecode,
        receiver.address,
        timestamp,
        span,
        templateId,
        owner.address,
        signature,
      );

      const [address] = await contractInstance.allVesting();

      await expect(tx)
        .to.emit(contractInstance, "VestingDeployed")
        .withArgs(address, receiver.address, timestamp, span, templateId);
    });
  });
});

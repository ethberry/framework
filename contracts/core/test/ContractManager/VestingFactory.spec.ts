import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@openzeppelin/test-helpers";

import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, nonce } from "@gemunion/contracts-constants";

import { span, templateId } from "../constants";
import { deployContractManager } from "./fixture";

describe("VestingFactory", function () {
  const factory = () => deployContractManager(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);

  describe("deployVesting", function () {
    it("should deploy contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const vesting = await ethers.getContractFactory("CliffVesting");

      const contractInstance = await factory();

      const timestamp: number = (await time.latest()).toNumber();
      // "Vesting(bytes bytecode,address account,uint64 startTimestamp,uint64 duration,uint256 templateId,bytes32 nonce)";

      const v = {
        bytecode: vesting.bytecode,
        account: receiver.address,
        startTimestamp: timestamp,
        duration: span,
        templateId,
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
          EIP712: [{ name: "v", type: "Vesting" }],
          Vesting: [
            { name: "bytecode", type: "bytes" },
            { name: "account", type: "address" },
            { name: "startTimestamp", type: "uint64" },
            { name: "duration", type: "uint64" },
            { name: "templateId", type: "uint256" },
            { name: "nonce", type: "bytes32" },
          ],
        },
        // Values
        { v },
      );
      const signer = owner.address;
      const bytecode = vesting.bytecode;
      const tx = await contractInstance.deployVesting(
        {
          signer,
          signature,
        },
        {
          bytecode,
          account: receiver.address,
          startTimestamp: timestamp,
          duration: span,
          templateId,
          nonce,
        },
      );

      const [address] = await contractInstance.allVesting();

      await expect(tx)
        .to.emit(contractInstance, "VestingDeployed")
        .withArgs(address, receiver.address, timestamp, span, templateId);
    });
  });
});

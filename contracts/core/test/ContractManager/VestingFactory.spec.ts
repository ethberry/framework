import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { nonce } from "@gemunion/contracts-constants";

import { contractTemplate, span } from "../constants";
import { deployContractManager } from "./fixture";

describe("VestingFactory", function () {
  const factory = () => deployContractManager(this.title);

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
            { name: "params", type: "Params" },
            { name: "args", type: "VestingArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
          VestingArgs: [
            { name: "account", type: "address" },
            { name: "startTimestamp", type: "uint64" },
            { name: "duration", type: "uint64" },
            { name: "contractTemplate", type: "string" },
          ],
        },
        // Values
        {
          params: {
            nonce,
            bytecode: vesting.bytecode,
          },
          args: {
            account: receiver.address,
            startTimestamp: timestamp,
            duration: span,
            contractTemplate,
          },
        },
      );

      const tx = await contractInstance.deployVesting(
        {
          nonce,
          bytecode: vesting.bytecode,
        },
        {
          account: receiver.address,
          startTimestamp: timestamp,
          duration: span,
          contractTemplate,
        },
        signature,
      );

      const [address] = await contractInstance.allVesting();

      // await expect(tx)
      //   .to.emit(contractInstance, "VestingDeployed")
      //   .withArgs(address, receiver.address, timestamp, span, templateId);

      await expect(tx)
        .to.emit(contractInstance, "VestingDeployed")
        .withNamedArgs({
          addr: address,
          args: {
            account: receiver.address,
            startTimestamp: BigNumber.from(timestamp),
            duration: BigNumber.from(span),
            contractTemplate,
          },
        });
    });
  });
});

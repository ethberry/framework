import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";
import { time } from "@openzeppelin/test-helpers";

import { testChainId } from "@framework/constants";

import { span } from "../../../constants";
import { blockAwait } from "../../../../scripts/utils/blockAwait";
import { ContractManager, LinearVesting } from "../../../../typechain-types";

export async function factoryDeployVesting(factoryInstance: ContractManager): Promise<LinearVesting> {
  const network = await ethers.provider.getNetwork();
  const [owner] = await ethers.getSigners();
  const current = await time.latest();
  const currentTime = current.toNumber();

  const vesting = await ethers.getContractFactory("LinearVesting");
  const nonce = utils.formatBytes32String("nonce1");

  const v = {
    bytecode: vesting.bytecode,
    account: owner.address,
    startTimestamp: currentTime,
    duration: span * 4,
    templateId: 1,
    nonce,
  };

  const signature = await owner._signTypedData(
    // Domain
    {
      name: "ContractManager",
      version: "1.0.0",
      chainId: network.chainId,
      verifyingContract: factoryInstance.address,
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

  if (network.chainId !== testChainId) {
    await blockAwait();
  }
  const signer = owner.address;
  const bytecode = vesting.bytecode;
  const tx = await factoryInstance.deployVesting(
    {
      signer,
      signature,
    },
    {
      bytecode,
      account: owner.address,
      startTimestamp: currentTime,
      duration: span * 4,
      templateId: 1,
      nonce,
    },
  );

  if (network.chainId === testChainId) {
    await blockAwait();
  }

  const [address] = await factoryInstance.allVesting();

  await expect(tx)
    .to.emit(factoryInstance, "VestingDeployed")
    .withArgs(address, owner.address, currentTime, span * 4, 1);

  return vesting.attach(address);
}

import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";
import { time } from "@openzeppelin/test-helpers";

import { blockAwait } from "@gemunion/contracts-utils";
import { testChainId } from "@framework/constants";

import { span } from "../../../constants";
import { ContractManager, LinearVesting } from "../../../../typechain-types";

export async function factoryDeployVesting(factoryInstance: ContractManager): Promise<LinearVesting> {
  const network = await ethers.provider.getNetwork();
  const [owner] = await ethers.getSigners();
  const current = await time.latest();
  const currentTime = current.toNumber();

  const vesting = await ethers.getContractFactory("LinearVesting");
  const nonce = utils.formatBytes32String("nonce1");
  // "EIP712(bytes32 nonce,bytes bytecode,address account,uint64 startTimestamp,uint64 duration,uint256 templateId)"

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
      account: owner.address,
      startTimestamp: currentTime,
      duration: span * 4,
      templateId: 1,
    },
  );

  if (network.chainId !== testChainId) {
    await blockAwait();
  }

  const tx = await factoryInstance.deployVesting(
    nonce,
    vesting.bytecode,
    owner.address,
    currentTime,
    span * 4,
    1,
    owner.address,
    signature,
  );

  if (network.chainId === testChainId) {
    await blockAwait();
  }

  const [address] = await factoryInstance.allVesting();
  // emit VestingDeployed(addr, account, startTimestamp, duration, templateId);

  await expect(tx)
    .to.emit(factoryInstance, "VestingDeployed")
    .withArgs(address, owner.address, currentTime, span * 4, 1);

  const vestingInstance = vesting.attach(address);

  return vestingInstance;
}

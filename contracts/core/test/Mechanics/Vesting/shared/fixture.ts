import { ethers } from "hardhat";
import { Contract, constants } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { amount, tokenName, tokenSymbol, span } from "@gemunion/contracts-constants";

import { ContractManager } from "../../../../typechain-types";

export async function deployVesting(name: string): Promise<Contract> {
  const [owner] = await ethers.getSigners();
  const current = await time.latest();
  const vestingFactory = await ethers.getContractFactory(name);
  const vestingInstance = await vestingFactory.deploy(owner.address, current.toNumber(), span * 4);

  await vestingInstance.topUp(
    [
      {
        tokenType: 0,
        token: constants.AddressZero,
        tokenId: 0,
        amount: amount * 100,
      },
    ],
    { value: amount * 100 },
  );

  return vestingInstance;
}

export async function deployERC20(contractInstance: Contract): Promise<Contract> {
  const factory = await ethers.getContractFactory("ERC20Simple");
  const instance = await factory.deploy(tokenName, tokenSymbol, amount * 100);
  await instance.mint(contractInstance.address, amount * 100);
  return instance;
}

export async function deployContractManager(): Promise<ContractManager> {
  const factory = await ethers.getContractFactory("ContractManager");
  const instance = await factory.deploy();
  return instance;
}

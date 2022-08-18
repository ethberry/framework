import { ethers } from "hardhat";
import { Contract } from "ethers";
import { MINTER_ROLE } from "../../../test/constants";

export async function deployClaim(contracts: Record<string, Contract>) {
  const claimFactory = await ethers.getContractFactory("ClaimProxy");
  const claimProxyInstance = await claimFactory.deploy();

  await contracts.contractManager.addFactory(claimProxyInstance.address, MINTER_ROLE);

  contracts.claimProxy = claimProxyInstance;
}

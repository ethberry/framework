import { ethers } from "hardhat";
import { Contract } from "ethers";

export async function deployClaim(contracts: Record<string, Contract>) {
  const claimFactory = await ethers.getContractFactory("ClaimProxy");
  const claimProxyInstance = await claimFactory.deploy();

  await contracts.contractManager.setFactories([claimProxyInstance.address], [contracts.contractManager.address]);

  contracts.claimProxy = claimProxyInstance;
}

import { ethers } from "hardhat";
import { Contract } from "ethers";

export async function deployClaim(contracts: Record<string, Contract>) {
  const claimFactory = await ethers.getContractFactory("ClaimProxy");
  contracts.claimProxy = await claimFactory.deploy();
}

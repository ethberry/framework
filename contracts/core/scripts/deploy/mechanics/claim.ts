import { ethers } from "hardhat";
import { Contract } from "ethers";
import { MINTER_ROLE } from "../../../test/constants";
import { blockAwait } from "../../utils/blockAwait";

export async function deployClaim(contracts: Record<string, Contract>) {
  const claimFactory = await ethers.getContractFactory("ClaimProxy");
  const claimProxyInstance = await claimFactory.deploy();
  contracts.claimProxy = claimProxyInstance;
  console.info("claimProxy deployed:", contracts.claimProxy.address);

  await blockAwait(3);
  const tx = await contracts.contractManager.addFactory(claimProxyInstance.address, MINTER_ROLE);
  console.info("addFactory claim, tx", tx.hash);
}

import { ethers, Wallet } from "ethers";

import VrfSol from "@framework/core-contracts/artifacts/@gemunion/contracts-chain-link-v2/contracts/mocks/VRFCoordinator.sol/VRFCoordinatorMock.json";

export const addConsumer = async function (
  vrfAddr: string,
  subId: number,
  consumerContract: string,
  provider: Wallet,
): Promise<string> {
  const contract = new ethers.Contract(vrfAddr, VrfSol.abi, provider);
  const trx = await contract.addConsumer(subId, consumerContract);
  return trx.hash;
};

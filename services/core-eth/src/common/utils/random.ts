import { ethers, utils, ContractTransaction, Wallet } from "ethers";
import VrfSol from "@framework/core-contracts/artifacts/contracts/MOCKS/ChainLink/VrfCoordinator.test.sol/VRFCoordinatorMock.json";

export const callRandom = async function (
  vrfAddr: string,
  consumerContract: string,
  requestId: string,
  provider: Wallet,
): Promise<string> {
  const contract = new ethers.Contract(vrfAddr, VrfSol.abi, provider);
  const trx: ContractTransaction = await contract.callBackWithRandomness(
    requestId,
    utils.randomBytes(32),
    consumerContract,
  );
  return trx.hash;
};

import { ContractTransaction, ethers, utils, Wallet, BigNumber } from "ethers";

import VrfSol from "@framework/core-contracts/artifacts/@gemunion/contracts-chain-link-v2/contracts/mocks/VRFCoordinator.sol/VRFCoordinatorMock.json";

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
    { gasLimit: BigNumber.from("600000") },
  );
  return trx.hash;
};

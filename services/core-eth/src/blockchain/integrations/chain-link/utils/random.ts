import { BigNumber, Contract, ContractTransaction, utils, Wallet } from "ethers";

import VrfV2Sol from "@framework/core-contracts/artifacts/@gemunion/contracts-chain-link-v2/contracts/mocks/VRFCoordinator.sol/VRFCoordinatorMock.json";

export interface IVrfRandomWordsFulfill {
  requestId: string;
  sender: string;
  subId: string;
  callbackGasLimit: string;
  numWords: string;
  keyHash: string;
}

export const callRandom = async function (
  vrfAddr: string,
  vrfData: IVrfRandomWordsFulfill,
  provider: Wallet,
): Promise<string> {
  const { requestId, keyHash, subId, callbackGasLimit, numWords, sender } = vrfData;
  const contract = new Contract(vrfAddr, VrfV2Sol.abi, provider);
  const blockNum = await provider.provider.getBlockNumber();

  const trx: ContractTransaction = await contract.fulfillRandomWords(
    BigNumber.from(requestId),
    keyHash,
    BigNumber.from(utils.randomBytes(32)), // randomness -> randomWords[i] = uint256(keccak256(abi.encode(randomness, i)));
    {
      blockNum,
      subId: BigNumber.from(subId),
      callbackGasLimit,
      numWords,
      sender,
    },
    { gasLimit: 800000 },
  );
  return trx.hash;
};

import { Contract, hexlify, randomBytes, Wallet } from "ethers";

import VrfV2Sol from "@framework/core-contracts/artifacts/@gemunion/contracts-chain-link-v2/contracts/mocks/VRFCoordinatorV2.sol/VRFCoordinatorV2Mock.json";

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
  const randomness = hexlify(randomBytes(32));
  const blockNum = await provider.provider?.getBlock("latest");
  // hexlify(toUtf8Bytes('<YOUR_STRING>'));
  const randomCallData = {
    requestId: BigInt(requestId),
    keyHash,
    randomness,
    blockNum: blockNum!.number,
    subId: BigInt(subId),
    callbackGasLimit: BigInt(callbackGasLimit),
    numWords: BigInt(numWords),
    sender,
  };

  const contract = new Contract(vrfAddr, VrfV2Sol.abi, provider);
  const trx = await contract.fulfillRandomWords(
    randomCallData.requestId,
    randomCallData.keyHash,
    randomCallData.randomness,
    {
      blockNum: randomCallData.blockNum,
      subId: randomCallData.subId,
      callbackGasLimit: randomCallData.callbackGasLimit,
      numWords: randomCallData.numWords,
      sender: randomCallData.sender,
    },
    { gasLimit: 800000 },
  );
  return trx.hash as string;
};

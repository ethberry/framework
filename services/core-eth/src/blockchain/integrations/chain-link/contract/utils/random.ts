import { Contract, hexlify, randomBytes, Wallet, ZeroAddress } from "ethers";

import VrfV2Sol from "@framework/core-contracts/artifacts/@gemunion/contracts-chain-link-v2-plus/contracts/mocks/VRFCoordinatorV2Plus.sol/VRFCoordinatorV2PlusMock.json";

export interface IVrfRandomWordsFulfill {
  requestId: string;
  sender: string;
  subId: string;
  callbackGasLimit: string;
  numWords: string;
  keyHash: string;
  extraArgs: string;
}

export const callRandom = async function (
  vrfAddr: string,
  vrfData: IVrfRandomWordsFulfill,
  provider: Wallet,
): Promise<string> {
  const { requestId, keyHash, subId, callbackGasLimit, numWords, sender, extraArgs } = vrfData;
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
    extraArgs,
  };

  const contract = new Contract(vrfAddr, VrfV2Sol.abi, provider);
  const trx = await contract.fulfillRandomWords(
    {
      pk: [0, 0],
      gamma: [0, 0],
      c: 0,
      s: 0,
      seed: randomCallData.randomness,
      uWitness: ZeroAddress,
      cGammaWitness: [0, 0],
      sHashWitness: [0, 0],
      zInv: randomCallData.requestId,
    },
    {
      blockNum: randomCallData.blockNum,
      subId: randomCallData.subId,
      callbackGasLimit: randomCallData.callbackGasLimit,
      numWords: randomCallData.numWords,
      sender: randomCallData.sender,
      extraArgs: randomCallData.extraArgs,
    },
    false,
  );
  return trx.hash as string;
};

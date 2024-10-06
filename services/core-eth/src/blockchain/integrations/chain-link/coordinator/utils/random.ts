import { Contract, randomBytes, Wallet, ZeroAddress } from "ethers";

import VrfV2Sol from "@framework/core-contracts/artifacts/@ethberry/contracts-chain-link-v2-plus/contracts/mocks/VRFCoordinatorV2Plus.sol/VRFCoordinatorV2PlusMock.json";

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
  const { requestId, subId, callbackGasLimit, numWords, sender, extraArgs } = vrfData;

  const generatedRandomBytes = randomBytes(32);
  const randomness = BigInt("0x" + Buffer.from(generatedRandomBytes).toString("hex"));

  const blockNum = await provider.provider?.getBlockNumber();

  const contract = new Contract(vrfAddr, VrfV2Sol.abi, provider);
  const trx = await contract.fulfillRandomWords(
    // Proof
    {
      pk: [0, 0],
      gamma: [0, 0],
      c: 0,
      s: 0,
      seed: randomness, // random number
      uWitness: ZeroAddress,
      cGammaWitness: [0, 0],
      sHashWitness: [0, 0],
      zInv: requestId, // requestId
    },
    // RequestCommitmentV2Plus
    {
      blockNum,
      subId,
      callbackGasLimit,
      numWords,
      sender,
      extraArgs,
    },
    // onlyPremium
    false,
    { gasLimit: 800000 },
  );
  return trx.hash as string;
};

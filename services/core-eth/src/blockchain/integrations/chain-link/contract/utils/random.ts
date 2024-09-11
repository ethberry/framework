import { Contract, randomBytes, Wallet, ZeroAddress } from "ethers";

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
  const { requestId, subId, callbackGasLimit, numWords, sender, extraArgs } = vrfData;

  const generatedRandomBytes = randomBytes(32);
  const randomness = BigInt("0x" + Buffer.from(generatedRandomBytes).toString("hex"));

  const block = await provider.provider?.getBlock("latest");
  // hexlify(toUtf8Bytes('<YOUR_STRING>'));

  // struct Proof {
  //   uint256[2] pk;
  //   uint256[2] gamma;
  //   uint256 c;
  //   uint256 s;
  //   uint256 seed;
  //   address uWitness;
  //   uint256[2] cGammaWitness;
  //   uint256[2] sHashWitness;
  //   uint256 zInv;
  // }

  const proof = {
    pk: [0, 0],
    gamma: [0, 0],
    c: 0,
    s: 0,
    seed: randomness, // random number
    uWitness: ZeroAddress,
    cGammaWitness: [0, 0],
    sHashWitness: [0, 0],
    zInv: requestId, // requestId
  };

  const rndReq = {
    blockNum: block!.number,
    subId,
    callbackGasLimit,
    numWords,
    sender,
    extraArgs,
  };

  const contract = new Contract(vrfAddr, VrfV2Sol.abi, provider);
  const trx = await contract.fulfillRandomWords(
    // Proof
    proof,
    // RequestCommitmentV2Plus
    rndReq,
    // onlyPremium
    false,
    { gasLimit: 800000 },
  );
  return trx.hash as string;
};

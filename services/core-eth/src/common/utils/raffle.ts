import { Contract, JsonRpcProvider } from "ethers";

import type { IRaffleCurrentRound } from "@framework/types";

import { recursivelyDecodeResult } from "./decodeResult";

export const getCurrentRaffleRound = async function (
  address: string,
  abi: any,
  provider: JsonRpcProvider,
): Promise<IRaffleCurrentRound> {
  const contract = new Contract(address, abi, provider);
  const roundInfo = await contract.getCurrentRoundInfo();
  return recursivelyDecodeResult(roundInfo) as IRaffleCurrentRound;
};

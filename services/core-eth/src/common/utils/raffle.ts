import { Contract, JsonRpcProvider } from "ethers";

import { recursivelyDecodeResult } from "@ethberry/utils-eth";
import type { IRaffleCurrentRound } from "@framework/types";

export const getCurrentRaffleRound = async function (
  address: string,
  abi: any,
  provider: JsonRpcProvider,
): Promise<IRaffleCurrentRound> {
  const contract = new Contract(address, abi, provider);
  const roundInfo = await contract.getCurrentRoundInfo();
  return recursivelyDecodeResult(roundInfo) as IRaffleCurrentRound;
};

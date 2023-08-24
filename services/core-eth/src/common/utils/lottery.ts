import { Contract, JsonRpcProvider } from "ethers";

import type { ILotteryCurrentRound } from "@framework/types";

import { recursivelyDecodeResult } from "./decodeResult";

export const getLotteryNumbers = (selected: Array<number>) => {
  const numbers: Array<boolean> = new Array(36).fill(false);
  selected.forEach(s => {
    numbers[s] = true;
  });
  return `{${numbers.join(",")}}`;
};

export const getCurrentLotteryRound = async function (
  address: string,
  abi: any,
  provider: JsonRpcProvider,
): Promise<ILotteryCurrentRound> {
  const contract = new Contract(address, abi, provider);
  const roundInfo = await contract.getCurrentRoundInfo();
  return recursivelyDecodeResult(roundInfo) as ILotteryCurrentRound;
};

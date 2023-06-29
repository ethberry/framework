import { ethers } from "ethers";
import { IAssetItem } from "@framework/types";
import { recursivelyDecodeResult } from "./decodeResult";

// TODO move to @types
export interface ILotteryCurrentRound {
  roundId: string;
  startTimestamp: string;
  endTimestamp: string;
  acceptedAsset: IAssetItem;
  ticketAsset: IAssetItem;
  maxTicket: string;
}

export const getLotteryNumbers = (selected: Array<number>) => {
  const numbers: Array<boolean> = new Array(36).fill(false);
  selected.forEach(s => {
    numbers[s] = true;
  });
  return `{${numbers.join(",")}}`;
};

export const getCurrentRound = async function (
  address: string,
  abi: any,
  provider: ethers.JsonRpcProvider,
): Promise<ILotteryCurrentRound> {
  const contract = new ethers.Contract(address, abi, provider);
  // const roundInfo = recursivelyDecodeResult((await contract.getCurrentRoundInfo()) as Result);
  const roundInfo = await contract.getCurrentRoundInfo();
  return recursivelyDecodeResult(roundInfo) as ILotteryCurrentRound;
};

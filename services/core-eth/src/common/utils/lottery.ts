import { ethers } from "ethers";
import { IAssetItem } from "@framework/types";

// TODO move to @types
export interface ILotteryCurrentRound {
  roundId: string;
  startTimestamp: string;
  endTimestamp: string;
  acceptedAsset: IAssetItem;
  ticketAsset: IAssetItem;
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

  return (await contract.getCurrentRoundInfo()) as ILotteryCurrentRound;
};

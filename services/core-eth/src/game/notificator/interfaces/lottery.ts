import { IAssetComponentHistory, ILotteryRound, IToken, IUser } from "@framework/types";

export interface ILotteryRoundStartData {
  round: ILotteryRound;
  address: string;
  transactionHash: string;
}

export interface ILotteryRoundEndData {
  round: ILotteryRound;
  address: string;
  transactionHash: string;
}

export interface ILotteryPrizeData {
  account: IUser;
  round: ILotteryRound;
  ticket: IToken;
  multiplier: string;
}

export interface ILotteryFinalizeData {
  round: ILotteryRound;
  prizeNumbers: Array<number>;
}

export interface ILotteryPurchaseData {
  address: string;
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  index: string; // ticket index inside round - serial number
  transactionHash: string;
}

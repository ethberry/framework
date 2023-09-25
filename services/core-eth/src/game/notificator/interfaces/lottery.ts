import { IAssetComponentHistory, ILotteryRound, IToken } from "@framework/types";

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
  round: ILotteryRound;
  ticket: IToken;
  multiplier: string;
  address: string;
  transactionHash: string;
}

export interface ILotteryFinalizeData {
  round: ILotteryRound;
  prizeNumbers: Array<number>;
  address: string;
  transactionHash: string;
}

export interface ILotteryPurchaseData {
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  index: string;
  address: string;
  transactionHash: string;
}

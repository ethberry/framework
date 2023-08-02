import { IAssetComponentHistory, ILotteryRound, IToken, IUser } from "@framework/types";

export interface IRoundStartLotteryData {
  round: ILotteryRound;
  address: string;
  transactionHash: string;
}

export interface IRoundEndLotteryData {
  round: ILotteryRound;
  address: string;
  transactionHash: string;
}

export interface IPrizeLotteryData {
  account: IUser;
  round: ILotteryRound;
  ticket: IToken;
  multiplier: string;
}

export interface IFinalizeLotteryData {
  round: ILotteryRound;
  prizeNumbers: Array<number>;
}

export interface IPurchaseLotteryData {
  address: string;
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  index: string; // ticket index inside round - serial number
  transactionHash: string;
}
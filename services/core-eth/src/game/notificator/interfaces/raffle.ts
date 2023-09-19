import { IAssetComponentHistory, IRaffleRound, IToken, IUser } from "@framework/types";

export interface IRoundStartRaffleData {
  round: IRaffleRound;
  address: string;
  transactionHash: string;
}

export interface IRoundEndRaffleData {
  round: IRaffleRound;
  address: string;
  transactionHash: string;
}

export interface IPrizeRaffleData {
  account: IUser;
  round: IRaffleRound;
  ticket: IToken;
  multiplier: string;
}

export interface IFinalizeRaffleData {
  round: IRaffleRound;
  prizeIndex: string;
  prizeNumber: string;
}

export interface IPurchaseRaffleData {
  address: string;
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  index: string; // ticket index inside round - serial number
  transactionHash: string;
}

import { IAssetComponentHistory, IRaffleRound, IToken, IUser } from "@framework/types";

export interface IRaffleRoundStartData {
  round: IRaffleRound;
  address: string;
  transactionHash: string;
}

export interface IRaffleRoundEndData {
  round: IRaffleRound;
  address: string;
  transactionHash: string;
}

export interface IRafflePrizeData {
  account: IUser;
  round: IRaffleRound;
  ticket: IToken;
  multiplier: string;
}

export interface IRaffleFinalizeData {
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

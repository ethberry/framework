import { IAssetComponentHistory, IRaffleRound, IToken } from "@framework/types";

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
  round: IRaffleRound;
  ticket: IToken;
  multiplier: string;
  address: string;
  transactionHash: string;
}

export interface IRaffleFinalizeData {
  round: IRaffleRound;
  prizeIndex: string;
  prizeNumber: string;
  address: string;
  transactionHash: string;
}

export interface IRafflePurchaseData {
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  index: string; // ticket index inside round - serial number
  address: string;
  transactionHash: string;
}

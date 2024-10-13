import type { IAssetItem } from "../exchange/common";

export enum RaffleEventType {
  RoundFinalized = "RoundFinalized",
  RoundStarted = "RoundStarted",
  RoundEnded = "RoundEnded",
  Released = "Released",
  Prize = "Prize",
}

export enum RaffleEventSignature {
  RoundFinalized = "RoundFinalized(uint256,uint8[6])",
  RoundStarted = "RoundStarted(uint256,uint256,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256))",
  RoundEnded = "RoundEnded(uint256,uint256)",
  Released = "Released(uint256,uint256)",
  Prize = "Prize(address,uint256,uint256,uint256)",
}

export interface IRaffleRoundStartedEvent {
  roundId: string;
  startTimestamp: string;
  maxTicket: string;
  ticket: IAssetItem;
  price: IAssetItem;
}

export interface IRaffleRoundFinalizedEvent {
  round: string;
  prizeIndex: string;
  prizeNumber: string;
}

export interface IRaffleRoundEndedEvent {
  round: string;
  endTimestamp: string;
}

export interface IRafflePrizeEvent {
  account: string;
  roundId: string;
  ticketId: bigint;
  amount: string; // always 0
}

export interface IRaffleReleaseEvent {
  round: string;
  amount: string;
}

export interface IRaffleRoundInfo {
  roundId: string;
  startTimestamp: string;
  endTimestamp: string;
  maxTicket: string;
  prizeNumber: string;
  acceptedAsset: IAssetItem;
  ticketAsset: IAssetItem;
}

export type TRaffleEvents =
  | IRaffleRoundStartedEvent
  | IRaffleRoundEndedEvent
  | IRafflePrizeEvent
  | IRaffleReleaseEvent
  | IRaffleRoundFinalizedEvent;

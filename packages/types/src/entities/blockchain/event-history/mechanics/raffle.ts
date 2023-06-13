import { IExchangeItem } from "../exchange/common";

export enum RaffleEventType {
  RoundFinalized = "RoundFinalized",
  RoundStarted = "RoundStarted",
  RoundEnded = "RoundEnded",
  Released = "Released",
  Prize = "Prize",
}

export interface IRaffleRoundStartedEvent {
  roundId: string;
  startTimestamp: string;
  maxTicket: string;
  ticket: IExchangeItem;
  price: IExchangeItem;
}

export interface IRaffleRoundFinalizedEvent {
  round: string;
  prizeNumber: string;
}

export interface IRaffleRoundEndedEvent {
  round: string;
  endTimestamp: string;
}

export interface IRafflePrizeEvent {
  account: string;
  ticketId: string;
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
  acceptedAsset: IExchangeItem;
  ticketAsset: IExchangeItem;
}

export type TRaffleEventData =
  | IRaffleRoundStartedEvent
  | IRaffleRoundEndedEvent
  | IRafflePrizeEvent
  | IRaffleReleaseEvent
  | IRaffleRoundFinalizedEvent;

export enum RaffleEventType {
  RoundFinalized = "RoundFinalized",
  RoundStarted = "RoundStarted",
  RoundEnded = "RoundEnded",
  PurchaseRaffle = "PurchaseRaffle",
  Released = "Released",
  Prize = "Prize",
}

export interface IRaffleRoundFinalizedEvent {
  round: string;
  prizeNumber: string;
}

export interface IRafflePurchaseEvent {
  tokenId: string;
  account: string;
  price: string;
  round: string;
}

export interface IRaffleRoundStartedEvent {
  round: string;
  startTimestamp: string;
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

export type TRaffleEventData =
  | IRaffleRoundStartedEvent
  | IRaffleRoundEndedEvent
  | IRafflePurchaseEvent
  | IRafflePrizeEvent
  | IRaffleReleaseEvent
  | IRaffleRoundFinalizedEvent;

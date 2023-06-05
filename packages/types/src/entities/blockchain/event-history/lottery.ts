export enum LotteryEventType {
  RoundFinalized = "RoundFinalized",
  RoundStarted = "RoundStarted",
  RoundEnded = "RoundEnded",
  PurchaseLottery = "PurchaseLottery",
  Released = "Released",
  Prize = "Prize",
}

export interface IRoundFinalizedEvent {
  round: string;
  winValues: Array<number>;
}

export interface ILotteryPurchaseLotteryEvent {
  tokenId: string;
  account: string;
  price: string;
  round: string;
  numbers: Array<boolean>;
}

export interface IRoundStartedEvent {
  round: string;
  startTimestamp: string;
}

export interface IRoundEndedEvent {
  round: string;
  endTimestamp: string;
}

export interface ILotteryPrizeEvent {
  account: string;
  ticketId: string;
  amount: string;
}

export interface ILotteryReleaseEvent {
  round: string;
  amount: string;
}

export type TLotteryEventData =
  | IRoundStartedEvent
  | IRoundEndedEvent
  | ILotteryPurchaseLotteryEvent
  | ILotteryPrizeEvent
  | ILotteryReleaseEvent
  | IRoundFinalizedEvent;

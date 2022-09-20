import type { IIdDateBase } from "@gemunion/types-collection";

export enum LotteryEventType {
  RoundStarted = "RoundStarted",
  RoundEnded = "RoundEnded",
  Purchase = "Purchase",
  Released = "Released",
  Prize = "Prize",
}

export interface ILotteryPurchaseEvent {
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
  | ILotteryPurchaseEvent
  | ILotteryPrizeEvent
  | ILotteryReleaseEvent;

export interface ILotteryHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: LotteryEventType;
  eventData: TLotteryEventData;
}

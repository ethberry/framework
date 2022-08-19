import { IIdDateBase } from "@gemunion/types-collection";

export enum LotteryEventType {
  RoundStarted = "RoundStarted",
  RoundEnded = "RoundEnded",
  Purchase = "Purchase",
  Released = "Released",
  Prize = "Prize",
}

export interface ILotteryPurchase {
  account: string;
  price: string;
  round: string;
  numbers: Array<boolean>;
}

export interface IRoundStarted {
  round: string;
  startTimestamp: string;
}

export interface IRoundEnded {
  round: string;
  endTimestamp: string;
}

export interface ILotteryPrize {
  account: string;
  ticketId: string;
  amount: string;
}

export interface ILotteryRelease {
  round: string;
  amount: string;
}

export type TLotteryEventData = IRoundStarted | IRoundEnded | ILotteryPurchase | ILotteryPrize | ILotteryRelease;

export interface ILotteryHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: LotteryEventType;
  eventData: TLotteryEventData;
}

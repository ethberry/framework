import { IIdDateBase } from "@gemunion/types-collection";

export enum LotteryEventType {
  RoundStarted = "RoundStarted",
  RoundEnded = "RoundEnded",
  Purchase = "Purchase",
  Released = "Released",
  Prize = "Prize",
}

export interface IRoundStarted {
  round: string;
  startTimestamp: string;
}

export interface IRoundEnded {
  round: string;
  endTimestamp: string;
}

export type TLotteryEventData = IRoundStarted | IRoundEnded;

export interface ILotteryHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: LotteryEventType;
  eventData: TLotteryEventData;
}

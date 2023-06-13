import { IExchangeItem } from "../exchange/common";

export enum LotteryEventType {
  RoundFinalized = "RoundFinalized",
  RoundStarted = "RoundStarted",
  RoundEnded = "RoundEnded",
  Released = "Released",
  Prize = "Prize",
}

// event RoundStarted(uint256 round, uint256 startTimestamp);
// event RoundEnded(uint256 round, uint256 endTimestamp);
// event RoundFinalized(uint256 round, uint8[6] winValues);
// event Released(uint256 round, uint256 amount);
// event Prize(address account, uint256 ticketId, uint256 amount);

export interface IRoundFinalizedEvent {
  round: string;
  winValues: Array<number>;
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

export interface ILotteryRoundInfo {
  roundId: string;
  startTimestamp: string;
  endTimestamp: string;
  maxTicket: string;
  values: Array<string>; // uint8[6] prize numbers
  aggregation: Array<string>; // uint8[7] prize counts
  acceptedAsset: IExchangeItem;
  ticketAsset: IExchangeItem;
}

export type TLotteryEventData =
  | IRoundStartedEvent
  | IRoundEndedEvent
  | ILotteryPrizeEvent
  | ILotteryReleaseEvent
  | IRoundFinalizedEvent;

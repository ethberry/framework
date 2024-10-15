import type { IAssetItem } from "../exchange";

export enum LotteryEventType {
  RoundFinalized = "RoundFinalized",
  RoundStarted = "RoundStarted",
  RoundEnded = "RoundEnded",
  Released = "Released",
  Prize = "Prize",
}

export enum LotteryEventSignature {
  RoundFinalized = "RoundFinalized(uint256,uint8[6])",
  RoundStarted = "RoundStarted(uint256,uint256,uint256,(uint8,address,uint256,uint256),(uint8,address,uint256,uint256))",
  RoundEnded = "RoundEnded(uint256,uint256)",
  Released = "Released(uint256,uint256)",
  Prize = "Prize(address,uint256,uint256,uint256)",
}

export interface IRoundStartedEvent {
  roundId: string;
  startTimestamp: string;
  maxTicket: string;
  ticket: IAssetItem;
  price: IAssetItem;
}

export interface IRoundFinalizedEvent {
  round: string;
  winValues: Array<number>;
}

export interface IRoundEndedEvent {
  round: string;
  endTimestamp: string;
}

export interface ILotteryPrizeEvent {
  account: string;
  roundId: string;
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
  balance: string;
  total: string;
  values: Array<string>; // uint8[6] prize numbers
  aggregation: Array<string>; // uint8[7] prize counts
  acceptedAsset: IAssetItem;
  ticketAsset: IAssetItem;
}

export type TLotteryEvents =
  | IRoundStartedEvent
  | IRoundEndedEvent
  | ILotteryPrizeEvent
  | ILotteryReleaseEvent
  | IRoundFinalizedEvent;

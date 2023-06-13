import { IExchangeItem } from "../exchange/common";

export enum WaitlistEventType {
  RewardSet = "RewardSet",
  ClaimReward = "ClaimReward",
}

export interface IWaitlistSetRewardEvent {
  externalId: string;
  items: Array<IExchangeItem>;
}

export interface IWaitlistClaimRewardEvent {
  from: string;
  externalId: string;
  items: Array<IExchangeItem>;
}

export type TWaitlistEvents = IWaitlistSetRewardEvent | IWaitlistClaimRewardEvent;

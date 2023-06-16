import { IAssetItem } from "../exchange/common";

export enum WaitlistEventType {
  RewardSet = "RewardSet",
  ClaimReward = "ClaimReward",
}

export interface IWaitlistSetRewardEvent {
  externalId: string;
  items: Array<IAssetItem>;
}

export interface IWaitlistClaimRewardEvent {
  from: string;
  externalId: string;
  items: Array<IAssetItem>;
}

export type TWaitlistEvents = IWaitlistSetRewardEvent | IWaitlistClaimRewardEvent;

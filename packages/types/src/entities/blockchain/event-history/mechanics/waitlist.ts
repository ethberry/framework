import { IAssetItem } from "../exchange/common";

export enum WaitListEventType {
  WaitListRewardSet = "WaitListRewardSet",
  WaitListRewardClaimed = "WaitListRewardClaimed",
}

export interface IWaitListRewardSetEvent {
  externalId: string;
  items: Array<IAssetItem>;
}

export interface IWaitListRewardClaimedEvent {
  from: string;
  externalId: string;
  items: Array<IAssetItem>;
}

export type TWaitListEvents = IWaitListRewardSetEvent | IWaitListRewardClaimedEvent;

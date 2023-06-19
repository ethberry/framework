import { IAssetItem } from "../exchange/common";

export enum WaitListEventType {
  WaitListRewardSet = "WaitListRewardSet",
  WaitListRewardClaimed = "WaitListRewardClaimed",
}

export interface IWaitListRewardSetEvent {
  externalId: string;
  root: string;
  items: Array<IAssetItem>;
}

export interface IWaitListRewardClaimedEvent {
  account: string;
  externalId: string;
  items: Array<IAssetItem>;
}

export type TWaitListEvents = IWaitListRewardSetEvent | IWaitListRewardClaimedEvent;

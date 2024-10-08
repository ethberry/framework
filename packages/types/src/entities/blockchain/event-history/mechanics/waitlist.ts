import type { IAssetItem } from "../exchange/common";

export enum WaitListEventType {
  WaitListRewardSet = "WaitListRewardSet",
  WaitListRewardClaimed = "WaitListRewardClaimed",
}
export enum WaitListEventSignature {
  WaitListRewardSet = "WaitListRewardSet(uint256,bytes32,(uint8,address,uint256,uint256)[])",
  WaitListRewardClaimed = "WaitListRewardClaimed(address,uint256,(uint8,address,uint256,uint256)[])",
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

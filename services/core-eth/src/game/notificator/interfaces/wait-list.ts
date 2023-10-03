import type { IWaitListItem, IWaitListList } from "@framework/types";

export interface IWaitListRewardSetData {
  waitListList: IWaitListList;
  address: string;
  transactionHash: string;
}

export interface IWaitListRewardClaimedData {
  waitListItem: IWaitListItem;
  address: string;
  transactionHash: string;
}

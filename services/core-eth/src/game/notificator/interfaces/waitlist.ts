import { IWaitListItem, IWaitListList } from "@framework/types";

export interface IWaitListRewardSetData {
  waitListList: IWaitListList;
  transactionHash: string;
}

export interface IWaitListRewardClaimedData {
  waitListItem: IWaitListItem;
  transactionHash: string;
}

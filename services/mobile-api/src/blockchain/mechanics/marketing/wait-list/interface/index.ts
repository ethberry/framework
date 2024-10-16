import type { IWaitListItem, IWaitListList } from "@framework/types";

export interface IRmqWaitListList {
  transactionHash: string;
  waitListList: IWaitListList;
}

export interface IRmqWaitListItem {
  transactionHash: string;
  waitListItem: IWaitListItem;
}

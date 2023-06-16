import { IWaitListList } from "@framework/types";

export interface IWaitListRewardSetData {
  waitList: IWaitListList;
  transactionHash: string;
}

export interface IWaitListRewardClaimedData {
  waitList: IWaitListList;
  transactionHash: string;
}

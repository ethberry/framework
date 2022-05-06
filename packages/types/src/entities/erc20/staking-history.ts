import { IIdBase } from "@gemunion/types-collection";

export enum Erc20StakingEventType {
  StakingStart = "StakingStart",
  StakingWithdraw = "StakingWithdraw",
}

export interface IErc20StakingDeposit {
  stakingId: string;
  owner: string;
  startTimestamp: string;
  finishTimestamp: string;
  amount: string;
  period: string;
}

export interface IErc20StakingWithdraw {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
  tokenId: string;
}

export type TErc20StakingEventData = IErc20StakingDeposit | IErc20StakingWithdraw;

export interface IErc20StakingHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: Erc20StakingEventType;
  eventData: TErc20StakingEventData;
}

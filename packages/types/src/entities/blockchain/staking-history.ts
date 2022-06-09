import { IIdDateBase } from "@gemunion/types-collection";

export enum StakingEventType {
  RuleCreated = "RuleCreated",
  StakingStart = "StakingStart",
  StakingWithdraw = "StakingWithdraw",
}

export interface IStakingDeposit {
  stakingId: string;
  owner: string;
  startTimestamp: string;
  finishTimestamp: string;
  amount: string;
  period: string;
}

export interface IStakingWithdraw {
  stakingId: string;
  owner: string;
  withdrawTimestamp: string;
  tokenId: string;
}

export type TStakingEventData = IStakingDeposit | IStakingWithdraw;

export interface IStakingHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: StakingEventType;
  eventData: TStakingEventData;
}

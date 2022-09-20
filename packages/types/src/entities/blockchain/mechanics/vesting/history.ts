import type { IIdDateBase } from "@gemunion/types-collection";

export enum VestingEventType {
  EtherReleased = "EtherReleased",
  ERC20Released = "ERC20Released",
}

export interface IVestingEtherReleasedEvent {
  amount: string;
}

export interface IVestingERC20ReleasedEvent {
  token: string;
  amount: string;
}

export type TVestingEventData = IVestingEtherReleasedEvent | IVestingERC20ReleasedEvent;

export interface IVestingHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: VestingEventType;
  eventData: TVestingEventData;
}

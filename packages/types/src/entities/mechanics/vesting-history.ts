import { IIdDateBase } from "@gemunion/types-collection";

export enum VestingEventType {
  EtherReleased = "EtherReleased",
  ERC20Released = "ERC20Released",
}

export interface IVestingEtherReleased {
  amount: string;
}

export interface IVestingERC20Released {
  token: string;
  amount: string;
}

export type TVestingEventData = IVestingEtherReleased | IVestingERC20Released;

export interface IVestingHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: VestingEventType;
  eventData: TVestingEventData;
}

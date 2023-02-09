// import type { IIdDateBase } from "@gemunion/types-collection";

export enum VestingEventType {
  EtherReleased = "EtherReleased",
  ERC20Released = "ERC20Released",
  EtherReceived = "EtherReceived",
  OwnershipTransferred = "OwnershipTransferred",
  // TODO add ERC20Received event
}

export interface IVestingOwnershipTransferreddEvent {
  previousOwner: string;
  newOwner: string;
}

export interface IVestingEtherReleasedEvent {
  amount: string;
}

export interface IVestingERC20ReleasedEvent {
  token: string;
  amount: string;
}

export interface IVestingEtherReceivedEvent {
  from: string;
  amount: string;
}

export type TVestingEventData =
  | IVestingEtherReleasedEvent
  | IVestingERC20ReleasedEvent
  | IVestingEtherReceivedEvent
  | IVestingOwnershipTransferreddEvent;

// export interface IVestingHistory extends IIdDateBase {
//   address: string;
//   transactionHash: string;
//   eventType: VestingEventType;
//   eventData: TVestingEventData;
// }

import { IIdBase } from "@gemunion/types-collection";

export enum Erc20VestingEventType {
  FlatVestingCreated = "FlatVestingCreated",
  EtherReleased = "EtherReleased",
  ERC20Released = "ERC20Released",
}

export interface IErc20VestingFlatVestingCreated {
  vesting: string;
  token: string;
  amount: string;
  beneficiary: string;
  startTimestamp: string;
  duration: string;
}

export interface IErc20VestingEtherReleased {
  amount: string;
}

export interface IErc20VestingERC20Released {
  token: string;
  amount: string;
}

export type TErc20VestingEventData =
  | IErc20VestingFlatVestingCreated
  | IErc20VestingEtherReleased
  | IErc20VestingERC20Released;

export interface IErc20VestingHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: Erc20VestingEventType;
  eventData: TErc20VestingEventData;
}

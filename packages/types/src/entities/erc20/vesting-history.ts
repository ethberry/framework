import { IIdBase } from "@gemunion/types-collection";

export enum Erc20VestingEventType {
  VestingDeployed = "VestingDeployed",
  EtherReleased = "EtherReleased",
  ERC20Released = "ERC20Released",
}

export interface IErc20VestingVestingDeployed {
  vesting: string;
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
  | IErc20VestingVestingDeployed
  | IErc20VestingEtherReleased
  | IErc20VestingERC20Released;

export interface IErc20VestingHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: Erc20VestingEventType;
  eventData: TErc20VestingEventData;
}

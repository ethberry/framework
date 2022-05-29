import { IIdBase } from "@gemunion/types-collection";

export enum Erc20TokenEventType {
  Transfer = "Transfer",
  Approval = "Approval",
  Snapshot = "Snapshot",
  RoleGranted = "RoleGranted",
  RoleRevoked = "RoleRevoked",
}

export interface IErc20TokenTransfer {
  from: string;
  to: string;
  value: string;
}

export interface IErc20TokenApprove {
  owner: string;
  spender: string;
  value: string;
}

export interface IErc20TokenSnapshot {
  id: string;
}

export interface IErc20RoleGrant {
  role: string;
  account: string;
  sender: string;
}

export type TErc20TokenEventData = IErc20TokenTransfer | IErc20TokenApprove | IErc20TokenSnapshot | IErc20RoleGrant;

export interface IErc20TokenHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: Erc20TokenEventType;
  eventData: TErc20TokenEventData;
}

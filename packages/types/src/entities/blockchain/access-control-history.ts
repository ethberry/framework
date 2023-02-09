import type { IIdDateBase } from "@gemunion/types-collection";

export enum AccessControlEventType {
  RoleGranted = "RoleGranted",
  RoleRevoked = "RoleRevoked",
  RoleAdminChanged = "RoleAdminChanged",
  OwnershipTransferred = "OwnershipTransferred",
}

export interface IAccessControlRoleGrantedEvent {
  role: string;
  account: string;
  sender: string;
}

export interface IAccessControlRoleRevokedEvent {
  role: string;
  account: string;
  sender: string;
}

export interface IAccessControlRoleAdminChangedEvent {
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
}

export interface IOwnershipTransferredEvent {
  previousOwner: string;
  newOwner: string;
}

export type TAccessControlEventData =
  | IAccessControlRoleGrantedEvent
  | IAccessControlRoleRevokedEvent
  | IAccessControlRoleAdminChangedEvent
  | IOwnershipTransferredEvent;

export interface IAccessControlHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: AccessControlEventType;
  eventData: TAccessControlEventData;
}

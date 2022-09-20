import type { IIdDateBase } from "@gemunion/types-collection";

export enum AccessControlEventType {
  RoleGranted = "RoleGranted",
  RoleRevoked = "RoleRevoked",
  RoleAdminChanged = "RoleAdminChanged",
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

export type TAccessControlEventData =
  | IAccessControlRoleGrantedEvent
  | IAccessControlRoleRevokedEvent
  | IAccessControlRoleAdminChangedEvent;

export interface IAccessControlHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: AccessControlEventType;
  eventData: TAccessControlEventData;
}

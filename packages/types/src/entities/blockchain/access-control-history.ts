import { IIdBase } from "@gemunion/types-collection";

export enum AccessControlEventType {
  RoleGranted = "RoleGranted",
  RoleRevoked = "RoleRevoked",
  RoleAdminChanged = "RoleAdminChanged",
}

export interface IAccessControlRoleGranted {
  role: string;
  account: string;
  sender: string;
}

export interface IAccessControlRoleRevoked {
  role: string;
  account: string;
  sender: string;
}

export interface IAccessControlRoleAdminChanged {
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
}

export type TAccessControlEventData =
  | IAccessControlRoleGranted
  | IAccessControlRoleRevoked
  | IAccessControlRoleAdminChanged;

export interface IAccessControlHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: AccessControlEventType;
  eventData: TAccessControlEventData;
}

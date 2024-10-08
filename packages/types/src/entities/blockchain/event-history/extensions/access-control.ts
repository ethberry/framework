export enum AccessControlEventType {
  RoleGranted = "RoleGranted",
  RoleRevoked = "RoleRevoked",
  RoleAdminChanged = "RoleAdminChanged",
  DefaultAdminTransferScheduled = "DefaultAdminTransferScheduled",
  DefaultAdminTransferCanceled = "DefaultAdminTransferCanceled",
  DefaultAdminDelayChangeScheduled = "DefaultAdminDelayChangeScheduled",
  DefaultAdminDelayChangeCanceled = "DefaultAdminDelayChangeCanceled",
  OwnershipTransferred = "OwnershipTransferred",
  OwnershipTransferStarted = "OwnershipTransferStarted",
}

export enum AccessControlEventSignature {
  RoleGranted = "RoleGranted(bytes32,address,address)",
  RoleRevoked = "RoleRevoked(bytes32,address,address)",
  RoleAdminChanged = "RoleAdminChanged(bytes32,bytes32,bytes32)",
  DefaultAdminTransferScheduled = "DefaultAdminTransferScheduled(address,uint48)",
  DefaultAdminTransferCanceled = "DefaultAdminTransferCanceled()",
  DefaultAdminDelayChangeScheduled = "DefaultAdminDelayChangeScheduled(uint48,uint48)",
  DefaultAdminDelayChangeCanceled = "DefaultAdminDelayChangeCanceled()",
  OwnershipTransferred = "OwnershipTransferred(address,address)",
  OwnershipTransferStarted = "OwnershipTransferStarted(address,address)",
}

// event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
export interface IAccessControlRoleGrantedEvent {
  role: string;
  account: string;
  sender: string;
}

// event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
export interface IAccessControlRoleRevokedEvent {
  role: string;
  account: string;
  sender: string;
}

// event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);
export interface IAccessControlRoleAdminChangedEvent {
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
}

// event DefaultAdminTransferScheduled(address indexed newAdmin, uint48 acceptSchedule);
export interface IAccessControlDefaultAdminTransferScheduledEvent {
  newAdmin: string;
  acceptSchedule: string;
}

// event DefaultAdminTransferCanceled();
export interface IAccessControlDefaultAdminTransferCanceledEvent {}

// event DefaultAdminDelayChangeScheduled(uint48 newDelay, uint48 effectSchedule);
export interface IAccessControlDefaultAdminDelayChangeScheduledEvent {
  newDelay: string;
  effectSchedule: string;
}

// event DefaultAdminDelayChangeCanceled();
export interface IAccessControlDefaultAdminDelayChangeCanceledEvent {}

// event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
export interface IOwnershipTransferredEvent {
  previousOwner: string;
  newOwner: string;
}

// event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
export interface IOwnershipTransferStartedEvent {
  previousOwner: string;
  newOwner: string;
}

export type TAccessControlEvents =
  | IAccessControlRoleGrantedEvent
  | IAccessControlRoleRevokedEvent
  | IAccessControlRoleAdminChangedEvent
  | IAccessControlDefaultAdminTransferScheduledEvent
  | IAccessControlDefaultAdminTransferCanceledEvent
  | IAccessControlDefaultAdminDelayChangeScheduledEvent
  | IAccessControlDefaultAdminDelayChangeCanceledEvent
  | IOwnershipTransferredEvent
  | IOwnershipTransferStartedEvent;

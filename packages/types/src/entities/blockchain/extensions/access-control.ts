import type { IIdDateBase } from "@gemunion/types-collection";

export enum AccessControlRoleType {
  DEFAULT_ADMIN_ROLE = "DEFAULT_ADMIN_ROLE",
  MINTER_ROLE = "MINTER_ROLE",
  PAUSER_ROLE = "PAUSER_ROLE",
  PREDICATE_ROLE = "PREDICATE_ROLE",
  DEPOSITOR_ROLE = "DEPOSITOR_ROLE",
  METADATA_ROLE = "METADATA_ROLE",
}

export enum AccessControlRoleHash {
  DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000",
  MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
  PAUSER_ROLE = "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a",
  PREDICATE_ROLE = "0x12ff340d0cd9c652c747ca35727e68c547d0f0bfa7758d2e77f75acef481b4f2",
  DEPOSITOR_ROLE = "0x8f4f2da22e8ac8f11e15f9fc141cddbb5deea8800186560abb6e68c5496619a9",
  METADATA_ROLE = "0x6bd6b5318a46e5fff572d5e4258a20774aab40cc35ac7680654b9081fcc82f80",
}

export interface IAccessControl extends IIdDateBase {
  address: string;
  account: string;
  role: AccessControlRoleType;
}

export type IPermissionControl = Pick<IAccessControl, "address" | "account">;

export interface IPermission {
  id: number;
  account: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  role: AccessControlRoleType;
}

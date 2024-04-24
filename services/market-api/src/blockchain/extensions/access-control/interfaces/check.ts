import { AccessControlRoleType } from "@framework/types";

export interface IAccessControlCheckDto {
  address: string;
  account: string;
  role: AccessControlRoleType;
}

export interface IAccessControlCheckTokenOwnershipDto {
  account: string;
  tokenId: number;
}

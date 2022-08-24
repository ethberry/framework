import { EnabledLanguages } from "@framework/constants";
import type { IIdDateBase } from "@gemunion/types-collection";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUser extends IIdDateBase {
  sub: string;
  email: string;
  displayName: string;
  imageUrl: string;
  language: EnabledLanguages;
  userStatus: UserStatus;
  userRoles: Array<UserRole>;
  comment: string;
  wallet: string;
  chainId: number;
}

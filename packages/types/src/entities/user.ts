import { EnabledLanguages } from "@framework/constants";
import { IIdBase } from "@gemunion/types-collection";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUser extends IIdBase {
  sub: string;
  email: string;
  displayName: string;
  imageUrl: string;
  language: EnabledLanguages;
  userStatus: UserStatus;
  userRoles: Array<UserRole>;
  comment: string;
  wallet: string;
}

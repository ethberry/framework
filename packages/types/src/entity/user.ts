import { EnabledLanguages } from "@gemunion/framework-constants";
import { IIdBase } from "@gemunion/types-collection";

import { IMerchant } from "./merchant";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  MERCHANT = "MERCHANT",
}

export interface IUser extends IIdBase {
  email: string;
  displayName: string;
  phoneNumber: string;
  imageUrl: string;
  merchant?: IMerchant;
  merchantId: number;
  language: EnabledLanguages;
  userStatus: UserStatus;
  userRoles: Array<UserRole>;
  comment: string;
}

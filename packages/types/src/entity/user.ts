import { EnabledLanguages } from "@gemunion/framework-constants-misc";

import { IMerchant } from "./merchant";
import { IBase } from "./base";

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

export interface IUser extends IBase {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  imageUrl: string;
  merchant?: IMerchant;
  merchantId: number;
  language: EnabledLanguages;
  userStatus: UserStatus;
  userRoles: Array<UserRole>;
  comment: string;
}

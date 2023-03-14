import { EnabledLanguages } from "@framework/constants";
import type { IIdDateBase } from "@gemunion/types-collection";
import { EnabledCountries, EnabledGenders } from "@gemunion/constants";
import { IAddress } from "../ecommerce";
import { IMerchant } from "./merchant";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum UserRole {
  ADMIN = "ADMIN",
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  CUSTOMER = "CUSTOMER",
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
  gender: EnabledGenders | null;
  country: EnabledCountries | null;
  addresses: Array<IAddress>;
  merchantId: number;
  merchant: IMerchant;
}

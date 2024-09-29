import { EnabledCountries } from "@ethberry/constants";
import type { IIdDateBase } from "@ethberry/types-collection";

import type { IUser } from "../infrastructure";

export enum AddressStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IAddress extends IIdDateBase {
  addressLine1: string;
  addressLine2?: string;
  addressStatus: AddressStatus;
  city: string;
  country: EnabledCountries;
  isDefault: boolean;
  state?: string;
  user?: IUser;
  userId: number;
  zip: string;
}

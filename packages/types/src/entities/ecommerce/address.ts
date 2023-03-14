import type { IIdDateBase } from "@gemunion/types-collection";

import { IUser } from "../infrastructure";

export enum AddressStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IAddress extends IIdDateBase {
  address: string;
  userId: number;
  user?: IUser;
  isDefault: boolean;
  addressStatus: AddressStatus;
}

import type { IIdDateBase } from "@gemunion/types-collection";

import type { IUser } from "./user";

export enum MerchantStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export interface IMerchant extends IIdDateBase {
  title: string;
  description: string;
  email: string;
  imageUrl: string;
  merchantStatus: MerchantStatus;
  users?: Array<IUser>;
}

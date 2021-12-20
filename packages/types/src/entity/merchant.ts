import { IIdBase } from "@gemunion/types-collection";

import { IUser } from "./user";
import { IProduct } from "./product";

export enum MerchantStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export interface IMerchant extends IIdBase {
  title: string;
  description: string;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  merchantStatus: MerchantStatus;
  users?: Array<IUser>;
  products?: Array<IProduct>;
}

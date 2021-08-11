import { IUser } from "./user";
import { IProduct } from "./product";
import { IBase } from "./base";

export enum MerchantStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export interface IMerchant extends IBase {
  title: string;
  description: string;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  merchantStatus: MerchantStatus;
  users?: Array<IUser>;
  products?: Array<IProduct>;
}

import type { IIdDateBase } from "@gemunion/types-collection";

import type { IUser } from "./user";
import type { IOrder, IProduct } from "../ecommerce";
import { RatePlan } from "./plan";

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
  ratePlan: RatePlan;
  users: Array<IUser>;
  products: Array<IProduct>;
  orders: Array<IOrder>;
}

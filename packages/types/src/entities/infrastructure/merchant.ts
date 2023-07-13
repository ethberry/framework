import type { IIdDateBase } from "@gemunion/types-collection";

import type { IUser } from "./user";
import type { IOrder, IProduct } from "../ecommerce";
import { RatePlanType } from "./rate-plan";

export enum MerchantStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export interface IMerchantSocial {
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
}

export interface IMerchant extends IIdDateBase {
  title: string;
  description: string;
  email: string;
  imageUrl: string;
  wallet: string;
  merchantStatus: MerchantStatus;
  social: IMerchantSocial;
  ratePlan: RatePlanType;
  users: Array<IUser>;
  products: Array<IProduct>;
  orders: Array<IOrder>;
}

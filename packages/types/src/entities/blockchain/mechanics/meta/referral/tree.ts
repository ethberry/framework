import type { IIdDateBase } from "@ethberry/types-collection";
import type { IMerchant } from "../../../../index";

export interface IReferralTree extends IIdDateBase {
  wallet: string;
  referral: string;
  level: number;
  merchantId: number;
  merchant: IMerchant;
  temp: boolean;
  children: Array<IReferralTree>;
}

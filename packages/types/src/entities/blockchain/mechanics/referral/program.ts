import type { IIdDateBase } from "@gemunion/types-collection";
import { IMerchant } from "../../..";

export interface IReferralProgram extends IIdDateBase {
  level: number;
  share: number;
  merchantId: number;
  merchant: IMerchant;
}

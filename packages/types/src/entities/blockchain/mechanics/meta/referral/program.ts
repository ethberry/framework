import type { IIdDateBase } from "@gemunion/types-collection";
import type { IMerchant } from "../../../../infrastructure";

export enum ReferralProgramStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IReferralProgram extends IIdDateBase {
  level: number;
  share: number;
  merchantId: number;
  merchant: IMerchant;
  strict: boolean;
  referralProgramStatus: ReferralProgramStatus;
}

import { ReferralProgramStatus } from "@framework/types";

export interface IReferralProgramUpdateDto {
  merchantId: number;
  referralProgramStatus: ReferralProgramStatus;
}

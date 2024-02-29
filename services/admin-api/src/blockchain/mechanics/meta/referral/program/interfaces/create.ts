import { ReferralProgramStatus } from "@framework/types";

export interface IReferralProgramLevelDto {
  level: number;
  share: number;
}

export interface IReferralProgramCreateDto {
  merchantId: number;
  levels: Array<IReferralProgramLevelDto>;
  referralProgramStatus: ReferralProgramStatus;
}

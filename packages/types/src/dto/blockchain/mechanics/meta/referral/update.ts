import type { IReferralProgramLevelDto } from "./create";

export interface IReferralProgramUpdateDto {
  merchantId: number;
  levels: Array<IReferralProgramLevelDto>;
}

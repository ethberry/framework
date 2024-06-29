import { ReferralProgramStatus } from "../../../../../entities";
import { IReferralProgramLevelDto } from "./create";

export interface IReferralProgramUpdateDto {
  levels?: Array<IReferralProgramLevelDto>;
  referralProgramStatus?: ReferralProgramStatus;
}

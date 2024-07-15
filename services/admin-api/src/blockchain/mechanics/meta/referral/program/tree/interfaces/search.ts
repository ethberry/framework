import type { ISearchDto } from "@gemunion/types-collection";

export interface IReferralTreeSearchDto extends ISearchDto {
  wallet: string;
  referral: string;
  level: number;
}

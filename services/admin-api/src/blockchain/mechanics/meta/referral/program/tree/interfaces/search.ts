import type { ISearchDto } from "@ethberry/types-collection";

export interface IReferralTreeSearchDto extends ISearchDto {
  wallet: string;
  referral: string;
  level: number;
}

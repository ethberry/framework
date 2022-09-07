import type { IPaginationDto, ISearchDto } from "@gemunion/types-collection";

export interface IReferralLeaderboardSearchDto extends IPaginationDto {
  account: string;
}

export interface IReferralReportSearchDto extends ISearchDto {
  startTimestamp: string;
  endTimestamp: string;
}

import type { IPaginationDto } from "@gemunion/types-collection";

export interface IAchievementsReportSearchDto extends IPaginationDto {
  account: string;
  startTimestamp: string;
  endTimestamp: string;
}

import type { IPaginationDto } from "@ethberry/types-collection";

export interface IAchievementsReportSearchDto extends IPaginationDto {
  account: string;
  startTimestamp: string;
  endTimestamp: string;
}

import type { ISearchDto } from "@gemunion/types-collection";

export interface IMarketplaceReportSearchDto extends ISearchDto {
  startTimestamp: string;
  endTimestamp: string;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

import type { ISearchDto } from "@ethberry/types-collection";

export interface IMarketplaceReportSearchDto extends ISearchDto {
  startTimestamp: string;
  endTimestamp: string;
  contractIds: Array<number>;
  templateIds: Array<number>;

  merchantId?: number;
}

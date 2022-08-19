import { ISearchDto } from "@gemunion/types-collection";

export interface IMarketplaceInsightsSearchDto extends ISearchDto {
  startTimestamp: string;
  endTimestamp: string;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

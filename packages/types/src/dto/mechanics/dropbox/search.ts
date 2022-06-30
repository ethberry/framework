import { ISearchDto } from "@gemunion/types-collection";

import { DropboxStatus } from "../../../entities";

export interface IDropboxSearchDto extends ISearchDto {
  dropboxStatus: Array<DropboxStatus>;
  contractIds: Array<number>;
  templateContractIds?: Array<number>;
  maxPrice: string;
  minPrice: string;
}

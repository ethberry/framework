import { ISearchDto } from "@gemunion/types-collection";

import { DropboxStatus } from "../../../entities";

export interface IDropboxSearchDto extends ISearchDto {
  dropboxStatus: Array<DropboxStatus>;
  uniContractIds: Array<number>;
  uniTemplateContractIds?: Array<number>;
  maxPrice: string;
  minPrice: string;
}

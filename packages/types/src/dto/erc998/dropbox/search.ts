import { ISearchDto } from "@gemunion/types-collection";

import { Erc998DropboxStatus } from "../../../entities";

export interface IErc998DropboxSearchDto extends ISearchDto {
  dropboxStatus: Array<Erc998DropboxStatus>;
  erc998CollectionIds: Array<number>;
  erc998TemplateCollectionIds?: Array<number>;
  maxPrice: string;
  minPrice: string;
}

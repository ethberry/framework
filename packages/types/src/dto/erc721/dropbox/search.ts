import { ISearchDto } from "@gemunion/types-collection";

import { Erc721DropboxStatus } from "../../../entities";

export interface IErc721DropboxSearchDto extends ISearchDto {
  dropboxStatus: Array<Erc721DropboxStatus>;
  erc721CollectionIds: Array<number>;
  erc721TemplateCollectionIds?: Array<number>;
  maxPrice: string;
  minPrice: string;
}

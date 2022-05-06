import { ISearchDto } from "@gemunion/types-collection";

import { Erc721CollectionStatus, Erc721CollectionType } from "../../../entities";

export interface IErc721CollectionSearchDto extends ISearchDto {
  collectionStatus: Array<Erc721CollectionStatus>;
  collectionType: Array<Erc721CollectionType>;
}

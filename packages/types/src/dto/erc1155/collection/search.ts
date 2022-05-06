import { ISearchDto } from "@gemunion/types-collection";

import { Erc1155CollectionStatus } from "../../../entities";

export interface IErc1155CollectionSearchDto extends ISearchDto {
  collectionStatus: Array<Erc1155CollectionStatus>;
}

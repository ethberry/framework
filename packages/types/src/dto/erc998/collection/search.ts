import { ISearchDto } from "@gemunion/types-collection";

import { Erc998CollectionStatus, Erc998CollectionType } from "../../../entities";

export interface IErc998CollectionSearchDto extends ISearchDto {
  collectionStatus: Array<Erc998CollectionStatus>;
  collectionType: Array<Erc998CollectionType>;
}

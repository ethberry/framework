import { Erc998CollectionStatus, Erc998CollectionType } from "../../../entities";

export interface IErc998CollectionAutocompleteDto {
  collectionType: Array<Erc998CollectionType>;
  collectionStatus: Array<Erc998CollectionStatus>;
}

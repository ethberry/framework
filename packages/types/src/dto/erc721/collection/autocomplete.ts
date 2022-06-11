import { Erc721CollectionStatus, Erc721CollectionType } from "../../../entities";

export interface IErc721CollectionAutocompleteDto {
  collectionType: Array<Erc721CollectionType>;
  collectionStatus: Array<Erc721CollectionStatus>;
}

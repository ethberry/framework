import { Erc1155TokenStatus } from "../../../entities";

export interface IErc1155TokenAutocompleteDto {
  tokenStatus: Array<Erc1155TokenStatus>;
  erc1155CollectionIds: Array<number>;
}

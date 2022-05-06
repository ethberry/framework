import { ISearchDto } from "@gemunion/types-collection";

export interface IErc1155TokenSearchDto extends ISearchDto {
  tokenId: string;
  erc1155CollectionIds: Array<number>;
  maxPrice: string;
  minPrice: string;
}

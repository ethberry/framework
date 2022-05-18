import { ISearchDto } from "@gemunion/types-collection";

import { Erc1155TokenStatus } from "../../../entities";

export interface IErc1155TokenSearchDto extends ISearchDto {
  tokenId: string;
  erc1155CollectionIds: Array<number>;
  maxPrice: string;
  minPrice: string;
  tokenStatus: Array<Erc1155TokenStatus>;
}

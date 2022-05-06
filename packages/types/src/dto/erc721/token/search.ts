import { ISearchDto } from "@gemunion/types-collection";

import { Erc721TokenStatus, TokenRarity } from "../../../entities";

export interface IErc721TokenSearchDto extends ISearchDto {
  tokenStatus: Array<Erc721TokenStatus>;
  tokenId: string;
  rarity: Array<TokenRarity>;
  erc721CollectionIds: Array<number>;
}

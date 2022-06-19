import { ISearchDto } from "@gemunion/types-collection";

import { Erc998TokenStatus, TokenRarity } from "../../../entities";

export interface IErc998TokenSearchDto extends ISearchDto {
  tokenStatus: Array<Erc998TokenStatus>;
  tokenId: string;
  rarity: Array<TokenRarity>;
  erc998CollectionIds: Array<number>;
}

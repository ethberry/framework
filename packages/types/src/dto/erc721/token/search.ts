import { ISearchDto } from "@gemunion/types-collection";

import { TokenRarity, TokenStatus } from "../../../entities";

export interface IErc721TokenSearchDto extends ISearchDto {
  tokenStatus: Array<TokenStatus>;
  tokenId: string;
  rarity: Array<TokenRarity>;
  contractIds: Array<number>;
}

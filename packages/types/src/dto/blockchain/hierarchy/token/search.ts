import { ISearchDto } from "@gemunion/types-collection";

import { TokenRarity, TokenStatus } from "../../../../entities";

export interface ITokenAttributesSearchDto {
  rarity?: Array<TokenRarity>;
}

export interface ITokenSearchDto extends ISearchDto {
  tokenStatus: Array<TokenStatus>;
  tokenId: string;
  attributes: ITokenAttributesSearchDto;
  contractIds: Array<number>;
}

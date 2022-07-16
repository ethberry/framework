import { ISearchDto } from "@gemunion/types-collection";

import { TokenAttributes, TokenRarity, TokenStatus } from "../../../../entities";

export interface ITokenAttributesSearchDto {
  [TokenAttributes.RARITY]?: Array<TokenRarity>;
}

export interface ITokenSearchDto extends ISearchDto {
  tokenStatus: Array<TokenStatus>;
  tokenId: string;
  attributes: ITokenAttributesSearchDto;
  contractIds: Array<number>;
}

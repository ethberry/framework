import type { ISearchDto } from "@gemunion/types-collection";

import { TokenAttributes, TokenRarity, TokenStatus } from "../../../../entities";

export interface ITokenAttributesSearchDto {
  [TokenAttributes.RARITY]?: Array<TokenRarity>;
  [TokenAttributes.GRADE]?: Array<number>;
  [TokenAttributes.TEMPLATE_ID]?: Array<number>;
}

export interface ITokenSearchDto extends ISearchDto {
  tokenStatus: Array<TokenStatus>;
  tokenId: string;
  attributes: ITokenAttributesSearchDto;
  contractIds: Array<number>;
  templateIds: Array<number>;
  account: string;
}

import type { ISearchDto } from "@gemunion/types-collection";

import { TokenMetadata, TokenRarity, TokenStatus } from "../../../../entities";

export interface ITokenMetadataSearchDto {
  [TokenMetadata.RARITY]?: Array<TokenRarity>;
  [TokenMetadata.LEVEL]?: Array<number>;
  [TokenMetadata.TEMPLATE_ID]?: Array<number>;
}

export interface ITokenSearchDto extends ISearchDto {
  tokenStatus: Array<TokenStatus>;
  tokenId: string;
  metadata: ITokenMetadataSearchDto;
  contractIds: Array<number>;
  templateIds: Array<number>;
  account: string;

  chainId: number;
  merchantId: number;
}

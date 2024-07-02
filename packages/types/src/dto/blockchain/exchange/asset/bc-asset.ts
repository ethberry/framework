import type { TokenType } from "@gemunion/types-blockchain";

export interface IBlockChainAssetDto {
  tokenType: TokenType;
  address: string;
  amount: string;
}

export interface IBlockChainAssetTemplateDto extends IBlockChainAssetDto {
  templateId: number;
}

export interface IBlockChainAssetTokenDto extends IBlockChainAssetTemplateDto {
  tokenId: number;
}

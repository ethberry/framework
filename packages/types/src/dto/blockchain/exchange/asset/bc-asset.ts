import type { TokenType } from "@ethberry/types-blockchain";

export interface IBlockChainAssetDto {
  address: string;
  amount: string;
}

export interface IBlockChainAssetTemplateDto extends IBlockChainAssetDto {
  tokenType: TokenType;
  templateId: number;
}

export interface IBlockChainAssetTokenDto extends IBlockChainAssetTemplateDto {
  tokenType: TokenType;
  tokenId: number;
}

import type { TokenType } from "@gemunion/types-blockchain";

export interface IBCAssetTemplateDto {
  tokenType: TokenType;
  address: string;
  templateId: number;
  amount: string;
}

export interface IBCAssetTokenDto {
  tokenType: TokenType;
  address: string;
  tokenId: number;
  amount: string;
}

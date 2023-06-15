import type { TokenType } from "@gemunion/types-blockchain";

export interface IBCAssetDto {
  tokenType: TokenType;
  address: string;
  templateId: number;
  amount: string;
}

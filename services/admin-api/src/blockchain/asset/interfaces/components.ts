import { TokenType } from "@framework/types";

export interface IAssetComponentDto {
  tokenType: TokenType;
  contractId: number;
  tokenId: number;
  amount: string;
}

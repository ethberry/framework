import { TokenType } from "@framework/types";

export interface IAssetComponentDto {
  id?: number;
  tokenType: TokenType;
  contractId: number;
  tokenId: number;
  amount: string;
}

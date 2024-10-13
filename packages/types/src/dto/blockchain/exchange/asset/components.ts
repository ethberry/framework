import type { TokenType } from "@ethberry/types-blockchain";

export interface IAssetComponentDto {
  id?: number;
  tokenType: TokenType;
  contractId: number;
  templateId: number | null;
  tokenId?: number | null;
  amount: bigint;
}

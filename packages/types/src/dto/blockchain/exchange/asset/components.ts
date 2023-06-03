import type { TokenType } from "@gemunion/types-blockchain";

export interface IAssetComponentDto {
  id?: number;
  tokenType: TokenType;
  contractId: number;
  templateId: number | null;
  amount: string;
}

import { TokenType } from "@framework/types";

export interface IAssetComponentDto {
  id?: number;
  tokenType: TokenType;
  contractId: number;
  templateId: number;
  amount: string;
}

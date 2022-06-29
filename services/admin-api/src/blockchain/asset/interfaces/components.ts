import { TokenType } from "@framework/types";

export interface IAssetComponentDto {
  tokenType: TokenType;
  uniContractId: number;
  uniTokenId: number;
  amount: string;
}

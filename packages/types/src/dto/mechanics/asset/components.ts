import { TokenType } from "../../../entities";

export interface IAssetComponentDto {
  id?: number;
  tokenType: TokenType;
  contractId: number;
  templateId: number;
  amount: string;
}

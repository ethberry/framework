import { TokenAttributes, TokenStatus, TokenType } from "../../../../entities";

export interface IMarketplaceSupplySearchDto {
  attribute: TokenAttributes;
  tokenStatus: TokenStatus;
  tokenType: TokenType;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

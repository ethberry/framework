import type { TokenType } from "@gemunion/types-blockchain";

import { TokenMetadata, TokenStatus } from "../../../../entities";

export interface IMarketplaceSupplySearchDto {
  attribute: TokenMetadata;
  tokenStatus: TokenStatus;
  tokenType: TokenType;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

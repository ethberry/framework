import type { TokenType } from "@gemunion/types-blockchain";

import { TokenAttributes, TokenStatus } from "../../../../entities";

export interface IMarketplaceSupplySearchDto {
  attribute: TokenAttributes;
  tokenStatus: TokenStatus;
  tokenType: TokenType;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

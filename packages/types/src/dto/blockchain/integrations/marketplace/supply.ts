import { TokenAttributes } from "../../../../entities";

export interface IMarketplaceSupplySearchDto {
  attribute: TokenAttributes;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

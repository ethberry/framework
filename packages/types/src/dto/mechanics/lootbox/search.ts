import { ISearchDto } from "@gemunion/types-collection";

import { LootboxStatus } from "../../../entities";

export interface ILootboxSearchDto extends ISearchDto {
  lootboxStatus: Array<LootboxStatus>;
  contractIds: Array<number>;
  templateContractIds?: Array<number>;
  maxPrice: string;
  minPrice: string;
}

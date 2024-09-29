import type { ISearchDto } from "@ethberry/types-collection";

import { LootBoxStatus } from "../../../../../entities";

export interface ILootBoxSearchDto extends ISearchDto {
  lootBoxStatus: Array<LootBoxStatus>;
  contractIds: Array<number>;
  templateIds: Array<number>;
  chainId: number;
  merchantId: number;
  maxPrice: string;
  minPrice: string;
}

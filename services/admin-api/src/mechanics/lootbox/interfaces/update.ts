import { LootboxStatus } from "@framework/types";

import { ILootboxCreateDto } from "./create";

export interface ILootboxUpdateDto extends ILootboxCreateDto {
  lootboxStatus: LootboxStatus;
}

import { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "../blockchain/asset";

export enum LootboxStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ILootbox extends ISearchable {
  imageUrl: string;
  price: IAsset;
  item: IAsset;
  lootboxStatus: LootboxStatus;
}

import { ISearchable } from "@gemunion/types-collection";

import { IContract } from "../blockchain/hierarchy/contract";
import { ITemplate } from "../blockchain/hierarchy/template";
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
  templateId: number;
  template?: ITemplate;
  contractId: number;
  contract?: IContract;
}

import { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "./asset";
import { ITemplate } from "../blockchain/hierarchy/template";
import { IToken } from "../blockchain/hierarchy/token";

export enum LootboxStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ILootbox extends ISearchable {
  imageUrl: string;
  price: IAsset;
  item: IAsset;
  templateId: number;
  template?: ITemplate;
  tokens?: Array<IToken>;
  lootboxStatus: LootboxStatus;
}

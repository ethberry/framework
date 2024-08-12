import type { ISearchable } from "@gemunion/types-collection";

import type { IAsset } from "../../../exchange/asset";
import type { ITemplate } from "../../../hierarchy/template";
import type { IToken } from "../../../hierarchy/token";

export enum LootBoxStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ILootBox extends ISearchable {
  imageUrl: string;
  contentId: number;
  content?: IAsset;
  templateId: number;
  template?: ITemplate;
  tokens?: Array<IToken>;
  lootBoxStatus: LootBoxStatus;
  min: number;
  max: number;
}

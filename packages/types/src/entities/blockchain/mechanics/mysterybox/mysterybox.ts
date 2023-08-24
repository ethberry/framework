import type { ISearchable } from "@gemunion/types-collection";

import type { IAsset } from "../../exchange/asset";
import type { ITemplate } from "../../hierarchy/template";
import type { IToken } from "../../hierarchy/token";

export enum MysteryBoxStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IMysteryBox extends ISearchable {
  imageUrl: string;
  item?: IAsset;
  templateId: number;
  template?: ITemplate;
  tokens?: Array<IToken>;
  mysteryBoxStatus: MysteryBoxStatus;
}

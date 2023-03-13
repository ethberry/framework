import type { ISearchable } from "@gemunion/types-collection";

import type { IAsset } from "../../exchange/asset";
import type { ITemplate } from "../../hierarchy/template";
import type { IToken } from "../../hierarchy/token";

export enum MysteryboxStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IMysterybox extends ISearchable {
  imageUrl: string;
  item?: IAsset;
  templateId: number;
  template?: ITemplate;
  tokens?: Array<IToken>;
  mysteryboxStatus: MysteryboxStatus;
}

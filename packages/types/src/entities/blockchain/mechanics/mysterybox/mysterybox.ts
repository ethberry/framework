import { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "../asset";
import { ITemplate } from "../../hierarchy/template";
import { IToken } from "../../hierarchy/token";

export enum MysteryboxStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IMysterybox extends ISearchable {
  imageUrl: string;
  item?: IAsset;
  price?: IAsset;
  templateId: number;
  template?: ITemplate;
  tokens?: Array<IToken>;
  mysteryboxStatus: MysteryboxStatus;
}

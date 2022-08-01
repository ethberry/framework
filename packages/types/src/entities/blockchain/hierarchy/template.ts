import { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "../../mechanics/asset";
import { IContract } from "./contract";
import { IToken } from "./token";

export enum TemplateStatus {
  ACTIVE = "ACTIVE",
  HIDDEN = "HIDDEN",
  INACTIVE = "INACTIVE",
}

export interface ITemplate extends ISearchable {
  imageUrl: string;
  price?: IAsset;
  priceId: number;
  cap: string;
  amount: string;
  templateStatus: TemplateStatus;
  contractId: number;
  contract?: IContract;
  tokens?: Array<IToken>;
}

import { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "../asset";
import { IContract } from "./contract";
import { IToken } from "./token";

export enum TemplateStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ITemplate extends ISearchable {
  imageUrl: string;
  attributes: any;
  price?: IAsset;
  priceId: number;
  cap: string;
  amount: string;
  templateStatus: TemplateStatus;
  contractId: number;
  contract?: IContract;
  tokens?: Array<IToken>;
}

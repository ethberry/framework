import type { ISearchable } from "@gemunion/types-collection";

import { IAsset } from "../exchange/asset";
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
  cid: string | null;
  templateStatus: TemplateStatus;
  contractId: number;
  contract?: IContract;
  tokens?: Array<IToken>;
}

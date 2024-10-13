import type { ISearchable } from "@ethberry/types-collection";

import type { IAsset } from "../exchange/asset";
import type { IContract } from "./contract";
import type { IToken } from "./token";

export enum TemplateStatus {
  ACTIVE = "ACTIVE",
  HIDDEN = "HIDDEN",
  INACTIVE = "INACTIVE",
}

export interface ITemplate extends ISearchable {
  imageUrl: string;
  title: string;
  price?: IAsset;
  priceId: number;
  cap: bigint;
  amount: bigint;
  cid: string | null;
  templateStatus: TemplateStatus;
  contractId: number;
  contract?: IContract;
  tokens?: Array<IToken>;
}

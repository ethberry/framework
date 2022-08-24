import type { IIdBase } from "@gemunion/types-collection";

import { TokenType } from "../common";
import { IContract } from "../hierarchy/contract";
import { ITemplate } from "../hierarchy/template";
import { IAsset } from "./asset";

export interface IAssetComponent extends IIdBase {
  tokenType: TokenType;
  contractId: number;
  contract?: IContract;
  templateId: number;
  template?: ITemplate;
  amount: string;
  asset?: IAsset;
  assetId: number;
}

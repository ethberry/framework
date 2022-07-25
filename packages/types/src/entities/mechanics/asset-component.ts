import { IIdBase } from "@gemunion/types-collection";

import { TokenType } from "../blockchain/common";
import { IContract } from "../blockchain/hierarchy/contract";
import { ITemplate } from "../blockchain/hierarchy/template";
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

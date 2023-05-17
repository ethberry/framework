import type { IIdBase } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import type { IContract } from "../hierarchy/contract";
import type { ITemplate } from "../hierarchy/template";
import type { IAsset } from "./asset";

export interface IAssetComponent extends IIdBase {
  tokenType: TokenType;
  contractId: number;
  contract?: IContract;
  templateId: number | null;
  template?: ITemplate;
  amount: string;
  asset?: IAsset;
  assetId: number;
}

import type { IIdBase } from "@ethberry/types-collection";
import type { TokenType } from "@ethberry/types-blockchain";

import type { IContract } from "../hierarchy/contract";
import type { ITemplate } from "../hierarchy/template";
import type { IToken } from "../hierarchy/token";
import type { IAsset } from "./asset";

export interface IAssetComponent extends IIdBase {
  tokenType: TokenType;
  contractId: number;
  contract?: IContract;
  templateId: number | null;
  template?: ITemplate;
  tokenId: bigint | number | null;
  token?: IToken;
  amount: bigint;
  asset?: IAsset;
  assetId: number;
}

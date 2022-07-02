import { IIdBase } from "@gemunion/types-collection";

import { TokenType } from "./common";
import { IContract } from "./hierarchy/contract";
import { IToken } from "./hierarchy/token";
import { IAsset } from "./asset";

export interface IAssetComponent extends IIdBase {
  tokenType: TokenType;
  contractId: number;
  contract?: IContract;
  tokenId: number;
  token?: IToken;
  amount: string;
  asset?: IAsset;
  assetId: number;
}

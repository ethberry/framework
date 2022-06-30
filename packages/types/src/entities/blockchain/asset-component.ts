import { IIdBase } from "@gemunion/types-collection";

import { TokenType } from "./common";
import { IUniContract } from "../uni-token/uni-contract";
import { IUniToken } from "../uni-token/uni-token";
import { IAsset } from "./asset";

export interface IAssetComponent extends IIdBase {
  tokenType: TokenType;
  uniContractId: number;
  uniContract?: IUniContract;
  uniTokenId: number;
  uniToken?: IUniToken;
  amount: string;
  asset?: IAsset;
  assetId: number;
}

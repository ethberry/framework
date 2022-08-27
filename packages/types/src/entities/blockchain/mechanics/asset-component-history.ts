import type { IIdBase } from "@gemunion/types-collection";

import { TokenType } from "../common";
import { IContract } from "../hierarchy/contract";
import { IToken } from "../hierarchy/token";

export enum ExchangeType {
  ITEM = "ITEM",
  PRICE = "PRICE",
}

export interface IAssetComponentHistory extends IIdBase {
  historyId: number;
  tokenType: TokenType;
  contractId: number;
  contract?: IContract;
  tokenId: number | null;
  token?: IToken;
  amount: string;
}

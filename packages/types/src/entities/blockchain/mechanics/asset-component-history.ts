import type { IIdBase } from "@gemunion/types-collection";

import { IToken } from "../hierarchy/token";
import { IExchangeHistory } from "./exchange-history";
import { IContract } from "../hierarchy/contract";

export enum ExchangeType {
  ITEM = "ITEM",
  PRICE = "PRICE",
}

export interface IAssetComponentHistory extends IIdBase {
  exchangeType: ExchangeType;
  historyId: number;
  history?: IExchangeHistory;
  contractId: number;
  contract?: IContract;
  tokenId: number | null;
  token?: IToken;
  amount: string;
}

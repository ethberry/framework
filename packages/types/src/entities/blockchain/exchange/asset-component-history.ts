import type { IIdBase } from "@gemunion/types-collection";

import { IToken } from "../hierarchy/token";
import { IContract } from "../hierarchy/contract";
import { IEventHistory } from "../event-history";

export enum ExchangeType {
  ITEM = "ITEM",
  PRICE = "PRICE",
}

export interface IAssetComponentHistory extends IIdBase {
  exchangeType: ExchangeType;
  historyId: number;
  history?: IEventHistory;
  contractId: number;
  contract?: IContract;
  tokenId: number | null;
  token?: IToken;
  amount: string;
}

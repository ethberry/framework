import type { IIdBase } from "@gemunion/types-collection";

import type { IToken } from "../hierarchy/token";
import type { IContract } from "../hierarchy/contract";
import type { IEventHistory } from "../event-history";

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

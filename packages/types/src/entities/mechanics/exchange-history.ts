import { IIdDateBase } from "@gemunion/types-collection";

import { ICraft } from "./craft";

export enum ExchangeEventType {
  Transaction = "Transaction",
}

export interface ITransaction {
  from: string;
  items: Array<[number, string, string, string]>;
  ingredients: Array<[number, string, string, string]>;
  ids: Array<string>;
}

export type TExchangeEventData = ITransaction;

export interface IExchangeHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ExchangeEventType;
  eventData: TExchangeEventData;
  exchangeId: number | null;
  exchange?: ICraft;
}

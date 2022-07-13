import { IIdDateBase } from "@gemunion/types-collection";

import { IExchangeRule } from "./exchange-rule";

export enum ExchangeEventType {
  Transaction = "Transaction",
}

export interface ITransaction {
  from: string;
  items: Array<[number, string, string, string]>;
  ingredients: Array<[number, string, string, string]>;
}

export type TExchangeEventData = ITransaction;

export interface IExchangeHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ExchangeEventType;
  eventData: TExchangeEventData;
  exchangeId: number | null;
  exchange?: IExchangeRule;
}

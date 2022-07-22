import { IIdDateBase } from "@gemunion/types-collection";

import { ICraft } from "./craft";

export enum ExchangeEventType {
  Claim = "Claim",
  Craft = "Craft",
  Lootbox = "Lootbox",
  Purchase = "Purchase",
  Upgrade = "Upgrade",
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
  exchange?: ICraft;
}

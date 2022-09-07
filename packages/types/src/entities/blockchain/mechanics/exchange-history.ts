import type { IIdDateBase } from "@gemunion/types-collection";

import { IAssetComponentHistory } from "./asset-component-history";

export enum ExchangeEventType {
  Claim = "Claim",
  Craft = "Craft",
  Mysterybox = "Mysterybox",
  Purchase = "Purchase",
  Upgrade = "Upgrade",
}

export type IExchangeItem = [number, string, string, string];

export interface IExchangePurchase {
  from: string;
  externalId: string;
  item: IExchangeItem;
  price: Array<IExchangeItem>;
}

// MODULE:CLAIM
export interface IExchangeClaim {
  from: string;
  externalId: string;
  items: IExchangeItem; // TODO array
}

// MODULE:CRAFT
export interface IExchangeCraft {
  from: string;
  externalId: string;
  items: Array<IExchangeItem>;
  price: Array<IExchangeItem>;
}

// MODULE:GRADE
export interface IExchangeGrade {
  from: string;
  externalId: string;
  items: IExchangeItem;
  price: Array<IExchangeItem>;
}

// MODULE:MYSTERYBOX
export interface IExchangeMysterybox {
  from: string;
  externalId: string;
  items: IExchangeItem; // TODO array
  price: Array<IExchangeItem>;
}

export type TExchangeEventData =
  | IExchangePurchase
  | IExchangeClaim
  | IExchangeCraft
  | IExchangeGrade
  | IExchangeMysterybox;

export interface IExchangeHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ExchangeEventType;
  eventData: TExchangeEventData;
  assets?: Array<IAssetComponentHistory>;
}

import { IExchangeItem } from "./common";

export interface IExchangePurchaseMysteryEvent {
  from: string;
  externalId: string;
  items: Array<IExchangeItem>;
  price: Array<IExchangeItem>;
}

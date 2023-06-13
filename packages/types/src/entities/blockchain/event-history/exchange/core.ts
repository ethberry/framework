import { IExchangeItem } from "./common";

export interface IExchangePurchaseEvent {
  from: string;
  externalId: string;
  item: IExchangeItem;
  price: Array<IExchangeItem>;
}

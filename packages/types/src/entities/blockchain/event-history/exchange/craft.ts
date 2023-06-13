import { IExchangeItem } from "./common";

export interface IExchangeCraftEvent {
  from: string;
  externalId: string;
  items: Array<IExchangeItem>;
  price: Array<IExchangeItem>;
}

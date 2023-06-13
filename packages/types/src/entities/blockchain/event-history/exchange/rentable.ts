import { IExchangeItem } from "./common";

// event Lend(address from, address to, uint64 expires, uint8 lendType, Asset[] items, Asset[] price);
export interface IExchangeLendEvent {
  from: string;
  to: string;
  expires: string;
  externalId: string;
  item: IExchangeItem;
  price: Array<IExchangeItem>;
}
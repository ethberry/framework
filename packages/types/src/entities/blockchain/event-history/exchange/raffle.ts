import { IExchangeItem } from "./common";

// event PurchaseRaffle(address account, Asset[] items, Asset price, uint256 roundId);
export interface IExchangePurchaseRaffleEvent {
  account: string;
  items: Array<IExchangeItem>;
  price: IExchangeItem;
  roundId: string;
}

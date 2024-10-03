import type { IAssetItem } from "./common";

// event Lend(address from, address to, uint64 expires, uint8 lendType, Asset[] items, Asset[] price);
export interface IExchangeRentableEvent {
  account: string;
  to: string;
  expires: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
}

export interface IExchangeRentableManyEvent {
  account: string;
  to: string;
  expires: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
}

import { IAssetItem } from "./common";

// event Lend(address from, address to, uint64 expires, uint8 lendType, Asset[] items, Asset[] price);
export interface IExchangeLendEvent {
  account: string;
  to: string;
  expires: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
}

export interface IExchangeLendManyEvent {
  account: string;
  to: string;
  expires: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
}

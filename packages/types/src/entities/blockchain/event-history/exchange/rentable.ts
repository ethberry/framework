import { IAssetItem } from "./common";

// event Lend(address from, address to, uint64 expires, uint8 lendType, Asset[] items, Asset[] price);
export interface IExchangeLendEvent {
  from: string;
  to: string;
  expires: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
}

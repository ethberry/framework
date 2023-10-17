import type { IAssetItem } from "./common";

export interface IExchangePurchaseEvent {
  account: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
}

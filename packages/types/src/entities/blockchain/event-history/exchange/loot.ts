import type { IAssetItem } from "./common";

export interface IExchangePurchaseLootBoxEvent {
  account: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
  content: Array<IAssetItem>;
}

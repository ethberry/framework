import type { IAssetItem } from "./common";

export interface IExchangePurchaseLootBoxEvent {
  account: string;
  externalId: string;
  items: Array<IAssetItem>;
  price: Array<IAssetItem>;
}

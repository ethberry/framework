import { IAssetItem } from "./common";

export interface IExchangePurchaseMysteryBoxEvent {
  account: string;
  externalId: string;
  items: Array<IAssetItem>;
  price: Array<IAssetItem>;
}

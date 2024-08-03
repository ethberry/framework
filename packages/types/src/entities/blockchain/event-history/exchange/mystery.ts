import type { IAssetItem } from "./common";

export interface IExchangePurchaseMysteryBoxEvent {
  account: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
  content: Array<IAssetItem>;
}

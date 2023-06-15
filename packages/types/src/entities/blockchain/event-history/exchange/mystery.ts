import { IAssetItem } from "./common";

export interface IExchangePurchaseMysteryEvent {
  from: string;
  externalId: string;
  items: Array<IAssetItem>;
  price: Array<IAssetItem>;
}

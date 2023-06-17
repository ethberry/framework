import { IAssetItem } from "./common";

export interface IExchangePurchaseEvent {
  from: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
}

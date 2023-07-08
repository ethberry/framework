import { IAssetItem } from "./common";

export interface IExchangeCraftEvent {
  account: string;
  externalId: string;
  items: Array<IAssetItem>;
  price: Array<IAssetItem>;
}

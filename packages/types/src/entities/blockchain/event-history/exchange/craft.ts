import { IAssetItem } from "./common";

export interface IExchangeCraftEvent {
  from: string;
  externalId: string;
  items: Array<IAssetItem>;
  price: Array<IAssetItem>;
}

import { IAssetItem } from "./common";

export interface IExchangeCraftEvent {
  account: string;
  externalId: number;
  items: Array<IAssetItem>;
  price: Array<IAssetItem>;
}

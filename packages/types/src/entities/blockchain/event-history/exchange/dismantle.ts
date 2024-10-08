import { IAssetItem } from "./common";

export interface IExchangeDismantleEvent {
  account: string;
  externalId: number;
  items: Array<IAssetItem>;
  price: Array<IAssetItem>;
}

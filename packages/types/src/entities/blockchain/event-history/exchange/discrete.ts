import type { IAssetItem } from "./common";

export interface IExchangeDiscreteEvent {
  account: string;
  externalId: string;
  item: IAssetItem;
  price: Array<IAssetItem>;
  attribute: string;
  level: string;
}

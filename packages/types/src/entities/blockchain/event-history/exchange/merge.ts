import type { IAssetItem } from "./common";

// event Merge(address account, uint256 externalId, Asset[] items, Asset[] price);

export interface IExchangeMergeEvent {
  account: string;
  externalId: number;
  items: Array<IAssetItem>;
  price: Array<IAssetItem>;
}

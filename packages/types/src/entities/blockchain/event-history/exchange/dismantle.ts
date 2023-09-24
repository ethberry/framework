import { IAssetItem } from "./common";

// event Dismantle(address account, uint256 externalId, Asset[] items, Asset[] price);

export interface IExchangeDismantleEvent {
  account: string;
  externalId: number;
  items: Array<IAssetItem>;
  price: Array<IAssetItem>;
}

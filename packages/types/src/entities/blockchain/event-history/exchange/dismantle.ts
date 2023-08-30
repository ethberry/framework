import { IAssetItem } from "./common";

// event Dismantle(address from, uint256 externalId, Asset[] items, Asset[] price);

export interface IExchangeDismantleEvent {
  from: string;
  externalId: number;
  items: Array<IAssetItem>;
  price: Array<IAssetItem>;
}

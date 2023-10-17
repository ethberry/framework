import type { IAssetItem } from "./common";

// event PurchaseRaffle(address account, uint256 externalId, Asset item, Asset price, uint256 roundId, uint256 index);
export interface IExchangePurchaseRaffleEvent {
  account: string;
  externalId: string;
  item: IAssetItem;
  price: IAssetItem;
  roundId: string;
  index: string;
}

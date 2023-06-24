import { IAssetItem } from "./common";

// PurchaseRaffle(address account, uint256 externalId, Asset[] items, Asset price, uint256 roundId);
export interface IExchangePurchaseRaffleEvent {
  account: string;
  externalId: string;
  items: Array<IAssetItem>;
  price: IAssetItem;
  roundId: string;
}

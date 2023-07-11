import { IAssetItem } from "./common";

// event PurchaseRaffle(address account, uint256 externalId, Asset item, Asset price, uint256 roundId);
export interface IExchangePurchaseRaffleEvent {
  account: string;
  externalId: string;
  item: IAssetItem;
  price: IAssetItem;
  roundId: string;
}

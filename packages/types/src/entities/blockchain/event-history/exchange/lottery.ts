import { IAssetItem } from "./common";

// PurchaseLottery(address account, uint256 externalId, Asset[] items, Asset price, uint256 roundId, bytes32 numbers);
export interface IExchangePurchaseLotteryEvent {
  account: string;
  externalId: string;
  items: Array<IAssetItem>;
  price: IAssetItem;
  roundId: string;
  numbers: string;
}

import type { IAssetItem } from "./common";

// event PurchaseLottery(address account, uint256 externalId, Asset item, Asset price, uint256 roundId, bytes32 numbers);
export interface IExchangePurchaseLotteryEvent {
  account: string;
  externalId: string;
  item: IAssetItem;
  price: IAssetItem;
  roundId: string;
  numbers: string;
}

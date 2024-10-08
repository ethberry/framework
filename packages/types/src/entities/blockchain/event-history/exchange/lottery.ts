import type { IAssetItem } from "./common";

export interface IExchangePurchaseLotteryEvent {
  account: string;
  externalId: string;
  item: IAssetItem;
  price: IAssetItem;
  roundId: string;
  numbers: string;
}

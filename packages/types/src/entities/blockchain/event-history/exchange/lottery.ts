import { IExchangeItem } from "./common";

// event PurchaseLottery(address account, Asset[] items, Asset price, uint256 roundId, bytes32 numbers);
export interface IExchangePurchaseLotteryEvent {
  account: string;
  items: Array<IExchangeItem>;
  price: IExchangeItem;
  roundId: string;
  numbers: string;
}

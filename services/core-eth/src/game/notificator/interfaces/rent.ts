import { IExchangeItem } from "@framework/types";

export interface IRentData {
  from: string;
  to: string;
  expires: string;
  externalId: string;
  item: IExchangeItem;
  price: Array<IExchangeItem>;
}

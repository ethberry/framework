import { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "./asset";
import { IExchangeHistory } from "./exchange-history";

export enum ExchangeStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IExchange extends IIdDateBase {
  itemId: number;
  item?: IAsset;
  ingredients: IAsset;
  exchangeStatus: ExchangeStatus;
  history?: Array<IExchangeHistory>;
}

import { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "../asset";
import { IExchangeHistory } from "../exchange-history";

export enum CraftStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ICraft extends IIdDateBase {
  item?: IAsset;
  price?: IAsset;
  craftStatus: CraftStatus;
  history?: Array<IExchangeHistory>;
}

import type { IIdDateBase } from "@ethberry/types-collection";

import type { IAsset } from "../../../exchange/asset";
import type { IEventHistory } from "../../../event-history";
import type { IMerchant } from "../../../../infrastructure";

export enum CraftStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ICraft extends IIdDateBase {
  item?: IAsset;
  price?: IAsset;
  merchantId: number;
  merchant?: IMerchant;
  craftStatus: CraftStatus;
  history?: Array<IEventHistory>;
}

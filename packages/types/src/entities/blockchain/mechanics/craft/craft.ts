import type { IIdDateBase } from "@gemunion/types-collection";

import type { IAsset } from "../../exchange/asset";
import type { IEventHistory } from "../../event-history";
import type { IMerchant } from "../../../infrastructure";

export enum CraftStatus {
  NEW = "NEW",
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

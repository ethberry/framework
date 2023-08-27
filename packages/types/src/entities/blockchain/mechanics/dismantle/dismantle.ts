import type { IIdDateBase } from "@gemunion/types-collection";

import type { IAsset } from "../../exchange/asset";
import type { IEventHistory } from "../../event-history";
import type { IMerchant } from "../../../infrastructure";

export enum DismantleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IDismantle extends IIdDateBase {
  item?: IAsset;
  price?: IAsset;
  merchantId: number;
  merchant?: IMerchant;
  dismantleStatus: DismantleStatus;
  history?: Array<IEventHistory>;
}

import type { IIdDateBase } from "@ethberry/types-collection";

import type { IAsset } from "../../../exchange/asset";
import type { IEventHistory } from "../../../event-history";
import type { IMerchant } from "../../../../infrastructure";

export enum MergeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IMerge extends IIdDateBase {
  item?: IAsset;
  price?: IAsset;
  merchantId: number;
  merchant?: IMerchant;
  mergeStatus: MergeStatus;
  history?: Array<IEventHistory>;
}

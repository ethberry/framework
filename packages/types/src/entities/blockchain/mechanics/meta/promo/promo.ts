import type { IIdDateBase } from "@ethberry/types-collection";

import type { IAsset } from "../../../exchange/asset";
import type { IMerchant } from "../../../../infrastructure";

export interface IAssetPromo extends IIdDateBase {
  item?: IAsset;
  price?: IAsset;
  startTimestamp: string;
  endTimestamp: string;
  merchantId: number;
  merchant?: IMerchant;
}

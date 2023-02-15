import type { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "../../exchange/asset";

export interface IDrop extends IIdDateBase {
  item?: IAsset;
  price?: IAsset;
  startTimestamp: string;
  endTimestamp: string;
}

import { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "./asset";

export interface IDrop extends IIdDateBase {
  price?: IAsset;
  item?: IAsset;
  startTimestamp: string;
  endTimestamp: string;
}

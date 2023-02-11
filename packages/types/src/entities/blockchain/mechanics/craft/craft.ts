import type { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "../../exchange/asset";
import { IEventHistory } from "../../event-history";

export enum CraftStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ICraft extends IIdDateBase {
  item?: IAsset;
  price?: IAsset;
  craftStatus: CraftStatus;
  history?: Array<IEventHistory>;
}

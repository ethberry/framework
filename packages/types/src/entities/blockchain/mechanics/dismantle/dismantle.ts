import type { IIdDateBase } from "@gemunion/types-collection";

import type { IAsset } from "../../exchange/asset";
import type { IEventHistory } from "../../event-history";
import type { IMerchant } from "../../../infrastructure";

export enum DismantleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum DismantleStrategy {
  FLAT = "FLAT",
  LINEAR = "LINEAR",
  EXPONENTIAL = "EXPONENTIAL",
}

export interface IDismantle extends IIdDateBase {
  item?: IAsset;
  price?: IAsset;
  merchantId: number;
  merchant?: IMerchant;
  dismantleStatus: DismantleStatus;
  rarityMultiplier: number;
  dismantleStrategy: DismantleStrategy;
  history?: Array<IEventHistory>;
}

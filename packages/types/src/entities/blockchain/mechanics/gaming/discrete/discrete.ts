import type { IIdDateBase } from "@ethberry/types-collection";

import type { IContract } from "../../../hierarchy/contract";
import type { IAsset } from "../../../exchange/asset";

export enum DiscreteStrategy {
  FLAT = "FLAT",
  LINEAR = "LINEAR",
  EXPONENTIAL = "EXPONENTIAL",
}

export enum DiscreteStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IDiscrete extends IIdDateBase {
  contractId: number;
  contract?: IContract;
  price?: IAsset;
  discreteStrategy: DiscreteStrategy;
  discreteStatus: DiscreteStatus;
  growthRate: number;
  attribute: string;
}

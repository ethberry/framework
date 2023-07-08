import type { IIdDateBase } from "@gemunion/types-collection";

import type { IContract } from "../../hierarchy/contract";
import type { IAsset } from "../../exchange/asset";

export enum GradeStrategy {
  FLAT = "FLAT",
  LINEAR = "LINEAR",
  EXPONENTIAL = "EXPONENTIAL",
}

export enum GradeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IGrade extends IIdDateBase {
  contractId: number;
  contract?: IContract;
  price?: IAsset;
  gradeStrategy: GradeStrategy;
  gradeStatus: GradeStatus;
  growthRate: number;
  attribute: string;
}

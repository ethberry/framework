import type { IIdDateBase } from "@gemunion/types-collection";

import type { IContract } from "../../hierarchy/contract";
import type { IAsset } from "../../exchange/asset";

export enum GradeStrategy {
  FLAT = "FLAT",
  LINEAR = "LINEAR",
  EXPONENTIAL = "EXPONENTIAL",
}

export enum GradeAttribute {
  GRADE = "GRADE",
}

export interface IGrade extends IIdDateBase {
  contractId: number;
  contract?: IContract;
  price?: IAsset;
  gradeStrategy: GradeStrategy;
  growthRate: number;
  attribute: GradeAttribute;
}

import type { IIdDateBase } from "@gemunion/types-collection";

import { IContract } from "../../hierarchy/contract";
import { IAsset } from "../../exchange/asset";

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
  gradeStrategy: GradeStrategy;
  growthRate: number;
  attribute: GradeAttribute;
  price?: IAsset;
}

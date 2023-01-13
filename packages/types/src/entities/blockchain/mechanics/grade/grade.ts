import type { IIdDateBase } from "@gemunion/types-collection";

import { IContract } from "../../hierarchy/contract";
import { TokenAttributes } from "../../hierarchy/token";
import { IAsset } from "../asset";

export enum GradeStrategy {
  FLAT = "FLAT",
  LINEAR = "LINEAR",
  EXPONENTIAL = "EXPONENTIAL",
}

export interface IGrade extends IIdDateBase {
  contractId: number;
  contract?: IContract;
  gradeStrategy: GradeStrategy;
  growthRate: number;
  attribute: TokenAttributes;
  price?: IAsset;
}

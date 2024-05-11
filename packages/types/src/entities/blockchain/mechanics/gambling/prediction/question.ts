import type { ISearchable } from "@gemunion/types-collection";

import type { IMerchant } from "../../../../infrastructure";
import type { IAsset } from "../../../exchange/asset";
import type { IPredictionAnswer } from "./answer";

export enum PredictionQuestionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum PredictionQuestionResult {
  YES = "YES",
  NO = "NO",
  DRAW = "DRAW",
  TECH = "TECH",
}

export interface IPredictionQuestion extends ISearchable {
  merchantId: number;
  merchant?: IMerchant;
  price?: IAsset;
  questionStatus: PredictionQuestionStatus;
  questionResult: PredictionQuestionResult;
  answers: Array<IPredictionAnswer>;
}

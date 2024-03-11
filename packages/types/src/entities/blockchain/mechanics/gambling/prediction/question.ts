import type { ISearchable } from "@gemunion/types-collection";
import { IMerchant } from "../../../../infrastructure";
import { IPredictionAnswer } from "./answer";

export enum PredictionQuestionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum PredictionQuestionAnswer {
  YES = "YES",
  NO = "NO",
  DRAW = "DRAW",
  TECH = "TECH",
}

export interface IPredictionQuestion extends ISearchable {
  merchantId: number;
  merchant?: IMerchant;
  questionStatus: PredictionQuestionStatus;
  answer: PredictionQuestionAnswer;
  answers: Array<IPredictionAnswer>;
}

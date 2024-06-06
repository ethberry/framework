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
  contractId: number;
  merchantId: number;
  merchant?: IMerchant;
  price?: IAsset;
  maxVotes: number;
  startTimestamp: string;
  endTimestamp: string;
  questionStatus: PredictionQuestionStatus;
  questionResult: PredictionQuestionResult;
  answers: Array<IPredictionAnswer>;
}

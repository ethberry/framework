import type { IIdDateBase } from "@gemunion/types-collection";
import type { IUser } from "../../../../infrastructure";
import type { IPredictionQuestion } from "./question";

export enum PredictionAnswer {
  YES = "YES",
  NO = "NO",
}

export interface IPredictionAnswer extends IIdDateBase {
  answer: PredictionAnswer;
  questionId: number;
  question: IPredictionQuestion;
  userId: number;
  user: IUser;
}

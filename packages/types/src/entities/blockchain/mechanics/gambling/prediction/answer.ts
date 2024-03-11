import type { IIdDateBase } from "@gemunion/types-collection";
import { IUser } from "../../../../infrastructure";
import { IPredictionQuestion } from "./question";

export enum PredictionAnswerAnswer {
  YES = "YES",
  NO = "NO",
}

export interface IPredictionAnswer extends IIdDateBase {
  answer: PredictionAnswerAnswer;
  questionId: number;
  question: IPredictionQuestion;
  userId: number;
  user: IUser;
}

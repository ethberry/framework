import type { IIdDateBase } from "@ethberry/types-collection";
import type { IUser } from "../../../../infrastructure";
import type { IPredictionQuestion } from "./question";

export enum PredictionAnswer {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export interface IPredictionAnswer extends IIdDateBase {
  answer: PredictionAnswer;
  questionId: number;
  question: IPredictionQuestion;
  userId: number;
  user: IUser;
}

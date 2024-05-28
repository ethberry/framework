import type { IPaginationDto } from "@gemunion/types-collection";
import { PredictionAnswer } from "../../../../../entities";

export interface IPredictionAnswerSearchDto extends IPaginationDto {
  questionIds: Array<number>;
}

export interface IPredictionAnswerCreateDto {
  questionId: number;
  answer: PredictionAnswer;
}

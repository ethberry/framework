import type { IPaginationDto } from "@gemunion/types-collection";

export interface IPredictionAnswerSearchDto extends IPaginationDto {
  questionIds: Array<number>;
}

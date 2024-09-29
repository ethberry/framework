import type { ISearchDto } from "@ethberry/types-collection";

import { PredictionQuestionStatus } from "../../../../../entities";

export interface IPredictionQuestionSearchDto extends ISearchDto {
  questionStatus: Array<PredictionQuestionStatus>;
}

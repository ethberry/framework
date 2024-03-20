import type { ISearchDto } from "@gemunion/types-collection";

import { PredictionQuestionStatus } from "../../../../../entities";

export interface IPredictionQuestionSearchDto extends ISearchDto {
  questionStatus: Array<PredictionQuestionStatus>;
}

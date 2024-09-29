import type { ISearchableDto } from "@ethberry/types-collection";
import type { IAssetDto } from "@framework/types";
import { PredictionQuestionStatus } from "@framework/types";

export interface IPredictionQuestionUpdateDto extends ISearchableDto {
  price: IAssetDto;
  questionStatus: PredictionQuestionStatus;
}

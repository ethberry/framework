import type { ISearchableDto } from "@gemunion/types-collection";
import type { IAssetDto } from "@framework/types";

export interface IPredictionQuestionUpdateDto extends ISearchableDto {
  price: IAssetDto;
}

import type { ISearchableDto } from "@gemunion/types-collection";
import type { IAssetDto } from "@framework/types";

export interface IPredictionQuestionCreateDto extends ISearchableDto {
  contractId: number;
  price: IAssetDto;
  maxVotes: number;
}

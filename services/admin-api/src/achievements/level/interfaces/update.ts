import type { ISearchableDto } from "@gemunion/types-collection";
import { IAssetDto } from "@framework/types";

export interface IAchievementLevelUpdateDto extends ISearchableDto {
  item: IAssetDto;
  amount: number;
}

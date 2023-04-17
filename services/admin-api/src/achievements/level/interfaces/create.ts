import type { ISearchableDto } from "@gemunion/types-collection";
import { IAssetDto } from "@framework/types";

export interface IAchievementLevelCreateDto extends ISearchableDto {
  achievementRuleId: number;
  item: IAssetDto;
  amount: number;
}

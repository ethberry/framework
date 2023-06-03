import type { ISearchableDto } from "@gemunion/types-collection";
import { IAssetDto } from "@framework/types";

export interface IAchievementLevelCreateDto extends ISearchableDto {
  achievementLevel: number;
  achievementRuleId: number;
  item: IAssetDto;
  amount: number;
  parameters: Record<string, string | number>;
  startTimestamp: string;
  endTimestamp: string;
}

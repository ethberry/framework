import type { ISearchableDto } from "@gemunion/types-collection";
import { IAssetDto } from "@framework/types";

export interface IAchievementLevelUpdateDto extends ISearchableDto {
  achievementLevel: number;
  startTimestamp: string;
  endTimestamp: string;
  item: IAssetDto;
  amount: number;
  parameters: Record<string, string | number>;
}

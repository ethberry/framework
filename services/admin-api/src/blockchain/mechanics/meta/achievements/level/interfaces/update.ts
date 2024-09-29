import type { ISearchableDto } from "@ethberry/types-collection";
import { IAssetDto } from "@framework/types";

export interface IAchievementLevelUpdateDto extends ISearchableDto {
  achievementLevel: number;
  reward: IAssetDto;
  amount: number;
  parameters: Record<string, string | number>;
}

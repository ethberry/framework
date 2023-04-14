import type { ISearchableDto } from "@gemunion/types-collection";

export interface IAchievementLevelCreateDto extends ISearchableDto {
  achievementRuleId: number;
  amount: number;
}

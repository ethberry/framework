import type { ISearchDto } from "@ethberry/types-collection";

export interface IAchievementLevelSearchDto extends ISearchDto {
  achievementRuleIds: Array<number>;
}

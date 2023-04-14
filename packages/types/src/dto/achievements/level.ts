import type { ISearchDto } from "@gemunion/types-collection";

export interface IAchievementLevelSearchDto extends ISearchDto {
  achievementRuleIds: Array<number>;
}

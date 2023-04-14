import type { ISearchDto } from "@gemunion/types-collection";

import { AchievementType } from "../../entities";

export interface IAchievementRuleSearchDto extends ISearchDto {
  achievementType: Array<AchievementType>;
}

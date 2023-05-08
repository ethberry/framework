import { AchievementRuleStatus, AchievementType, ContractEventType } from "@framework/types";

export interface IAchievementRuleUpdateDto {
  title: string;
  description: string;
  achievementType: AchievementType;
  achievementStatus: AchievementRuleStatus;
  eventType: ContractEventType;
}

import { AchievementRuleStatus, AchievementType, ContractEventType } from "@framework/types";

export interface IAchievementRuleCreateDto {
  title: string;
  description: string;
  contractId: number;
  achievementType: AchievementType;
  achievementStatus: AchievementRuleStatus;
  eventType: ContractEventType;
}

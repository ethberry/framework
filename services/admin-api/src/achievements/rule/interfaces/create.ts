import { AchievementRuleStatus, AchievementType, ContractEventType, IAssetDto } from "@framework/types";

export interface IAchievementRuleCreateDto {
  title: string;
  description: string;
  contractId: number;
  item: IAssetDto;
  achievementType: AchievementType;
  achievementStatus: AchievementRuleStatus;
  eventType: ContractEventType;
}

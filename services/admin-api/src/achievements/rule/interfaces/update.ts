import { AchievementRuleStatus, AchievementType, ContractEventType, IAssetDto } from "@framework/types";

export interface IAchievementRuleUpdateDto {
  title: string;
  description: string;
  achievementType: AchievementType;
  achievementStatus: AchievementRuleStatus;
  eventType: ContractEventType;
  item: IAssetDto;
}

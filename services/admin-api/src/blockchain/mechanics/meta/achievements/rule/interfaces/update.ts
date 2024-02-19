import { AchievementRuleStatus, ContractEventType, IAssetDto } from "@framework/types";

export interface IAchievementRuleUpdateDto {
  title: string;
  description: string;
  achievementStatus: AchievementRuleStatus;
  eventType: ContractEventType;
  item: IAssetDto;
  startTimestamp: string;
  endTimestamp: string;
}

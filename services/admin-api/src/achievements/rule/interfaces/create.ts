import { AchievementRuleStatus, ContractEventType, IAssetDto } from "@framework/types";

export interface IAchievementRuleCreateDto {
  title: string;
  description: string;
  contractId: number;
  item: IAssetDto;
  eventType: ContractEventType;
  startTimestamp: string;
  endTimestamp: string;
  achievementStatus: AchievementRuleStatus;
}

import { AchievementRuleStatus, TContractEventType, IAssetDto } from "@framework/types";

export interface IAchievementRuleCreateDto {
  title: string;
  description: string;
  contractId: number;
  item: IAssetDto;
  eventType: TContractEventType;
  startTimestamp: string;
  endTimestamp: string;
  achievementStatus: AchievementRuleStatus;
}

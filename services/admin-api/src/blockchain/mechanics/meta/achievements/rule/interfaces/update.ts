import { AchievementRuleStatus, TContractEventType, IAssetDto } from "@framework/types";

export interface IAchievementRuleUpdateDto {
  title: string;
  description: string;
  achievementStatus: AchievementRuleStatus;
  eventType: TContractEventType;
  item: IAssetDto;
  startTimestamp: string;
  endTimestamp: string;
}

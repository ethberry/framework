import { AchievementType, ContractEventType, IAssetDto } from "@framework/types";

export interface IAchievementRuleCreateDto {
  title: string;
  description: string;
  contractId: number;
  item: IAssetDto;
  achievementType: AchievementType;
  eventType: ContractEventType;
}

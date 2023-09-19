import type { IAssetDto } from "@framework/types";
import { AchievementType, ContractEventType } from "@framework/types";

export interface IAchievementRuleCreateDto {
  title: string;
  description: string;
  contractId: number;
  item: IAssetDto;
  achievementType: AchievementType;
  eventType: ContractEventType;
}

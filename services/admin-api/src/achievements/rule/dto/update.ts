import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

import { SearchableDto } from "@gemunion/collection";
import { AchievementRuleStatus, AchievementType, ContractEventType } from "@framework/types";

import { IAchievementRuleUpdateDto } from "../interfaces";

export class AchievementRuleUpdateDto extends SearchableDto implements IAchievementRuleUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(AchievementType, { message: "badInput" })
  public achievementType: AchievementType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(AchievementRuleStatus, { message: "badInput" })
  public achievementStatus: AchievementRuleStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ContractEventType, { message: "badInput" })
  public eventType: ContractEventType;
}

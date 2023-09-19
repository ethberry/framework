import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import { AchievementRuleStatus, AchievementType, ContractEventType } from "@framework/types";

import { ItemDto } from "../../../blockchain/exchange/asset/dto";
import type { IAchievementRuleUpdateDto } from "../interfaces";

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

  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiPropertyOptional({
    type: ItemDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;
}

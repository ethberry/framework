import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";

import { IAchievementRuleCreateDto } from "../interfaces";
import { AchievementRuleStatus, AchievementType, ContractEventType } from "@framework/types";
import { ItemDto } from "../../../blockchain/exchange/asset/dto";

export class AchievementRuleCreateDto extends SearchableDto implements IAchievementRuleCreateDto {
  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

  @ApiProperty()
  @Transform(({ value }) => value as AchievementType)
  @IsEnum(AchievementType, { message: "badInput" })
  public achievementType: AchievementType;

  @ApiProperty()
  @IsEnum(AchievementRuleStatus, { message: "badInput" })
  public achievementStatus: AchievementRuleStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ContractEventType, { message: "badInput" })
  public eventType: ContractEventType;
}

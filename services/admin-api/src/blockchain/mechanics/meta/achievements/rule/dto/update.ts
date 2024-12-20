import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";
import { AllTypesDto, IsBeforeDate } from "@gemunion/nest-js-validators";
import { AchievementRuleStatus, ContractEventType } from "@framework/types";

import { IAchievementRuleUpdateDto } from "../interfaces";

export class AchievementRuleUpdateDto extends SearchableDto implements IAchievementRuleUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(AchievementRuleStatus, { message: "badInput" })
  public achievementStatus: AchievementRuleStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ContractEventType, { message: "badInput" })
  public eventType: ContractEventType;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiPropertyOptional({
    type: AllTypesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AllTypesDto)
  public item: InstanceType<typeof AllTypesDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  @IsBeforeDate({ relatedPropertyName: "endTimestamp" })
  public startTimestamp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;
}

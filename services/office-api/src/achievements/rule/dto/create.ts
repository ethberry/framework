import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min, ValidateNested, IsISO8601, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";

import { AchievementRuleStatus, ContractEventType } from "@framework/types";
import { IsBeforeDate } from "@gemunion/nest-js-validators";
import { SearchableDto } from "@gemunion/collection";

import { AllTypesDto } from "../../../blockchain/exchange/asset/dto";
import { IAchievementRuleCreateDto } from "../interfaces";

export class AchievementRuleCreateDto extends SearchableDto implements IAchievementRuleCreateDto {
  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty({
    type: AllTypesDto,
  })
  @ValidateNested()
  @Type(() => AllTypesDto)
  public item: InstanceType<typeof AllTypesDto>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ContractEventType, { message: "badInput" })
  public eventType: ContractEventType;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  @IsBeforeDate({ relatedPropertyName: "endTimestamp" })
  public startTimestamp: string;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({}, { message: "patternMismatch" })
  public endTimestamp: string;

  @ApiProperty({
    enum: AchievementRuleStatus,
  })
  @Transform(({ value }) => value as AchievementRuleStatus)
  @IsEnum(AchievementRuleStatus, { message: "badInput" })
  public achievementStatus: AchievementRuleStatus;
}

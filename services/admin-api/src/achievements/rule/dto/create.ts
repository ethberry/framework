import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, Min } from "class-validator";
import { Transform } from "class-transformer";
import { SearchableDto } from "@gemunion/collection";

import { IAchievementRuleCreateDto } from "../interfaces";
import { AchievementRuleStatus, AchievementType, ContractEventType } from "@framework/types";

export class AchievementRuleCreateDto extends SearchableDto implements IAchievementRuleCreateDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;

  @ApiProperty()
  @Transform(({ value }) => value as AchievementType)
  @IsEnum(AchievementType, { message: "badInput" })
  public achievementType: AchievementType;

  @ApiProperty()
  @IsEnum(AchievementRuleStatus, { message: "badInput" })
  public achievementStatus: AchievementRuleStatus;

  @ApiProperty()
  @IsEnum(ContractEventType, { message: "badInput" })
  public eventType: ContractEventType;
}

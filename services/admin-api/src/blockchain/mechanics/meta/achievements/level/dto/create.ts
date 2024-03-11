import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { SearchableDto } from "@gemunion/collection";

import { IAchievementLevelCreateDto } from "../interfaces";
import { AllTypesDto } from "../../../../../exchange/asset/dto";

export class AchievementLevelCreateDto extends SearchableDto implements IAchievementLevelCreateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public achievementLevel: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public achievementRuleId: number;

  @ApiProperty({
    type: AllTypesDto,
  })
  @ValidateNested()
  @Type(() => AllTypesDto)
  public reward: InstanceType<typeof AllTypesDto>;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Max(1000, { message: "rangeOverflow" })
  public amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  // @IsJSON({ message: "patternMismatch" })
  public parameters: Record<string, string | number>;
}

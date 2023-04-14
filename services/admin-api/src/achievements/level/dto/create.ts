import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Max, Min } from "class-validator";

import { SearchableDto } from "@gemunion/collection";

import { IAchievementLevelCreateDto } from "../interfaces";

export class AchievementLevelCreateDto extends SearchableDto implements IAchievementLevelCreateDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public achievementRuleId: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @Max(1000, { message: "rangeOverflow" })
  public amount: number;
}

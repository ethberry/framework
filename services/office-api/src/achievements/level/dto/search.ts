import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, Min } from "class-validator";

import { IAchievementLevelSearchDto } from "@framework/types";
import { SearchDto } from "@gemunion/collection";

export class AchievementLevelSearchDto extends SearchDto implements IAchievementLevelSearchDto {
  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "rangeUnderflow" })
  @Type(() => Number)
  public achievementRuleIds: Array<number>;
}

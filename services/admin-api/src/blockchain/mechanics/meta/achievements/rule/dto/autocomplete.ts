import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { AchievementRuleStatus, IAchievementRuleAutocompleteDto } from "@framework/types";

export class AchievementRuleAutocompleteDto implements IAchievementRuleAutocompleteDto {
  @ApiPropertyOptional({
    enum: AchievementRuleStatus,
    isArray: true,
    // https://github.com/OAI/OpenAPI-Specification/issues/1706
    // format: "deepObject"
  })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @Transform(({ value }) => value as Array<AchievementRuleStatus>)
  @IsEnum(AchievementRuleStatus, { each: true, message: "badInput" })
  public achievementStatus: Array<AchievementRuleStatus>;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Transform } from "class-transformer";

import { IAchievementsItemCountDto } from "../interfaces";
import { AchievementType } from "@framework/types";

export class AchievementsItemCountDto implements IAchievementsItemCountDto {
  @ApiProperty({
    enum: AchievementType,
  })
  @Transform(({ value }) => value as AchievementType)
  @IsEnum(AchievementType, { message: "badInput" })
  public achievementType: AchievementType;
}

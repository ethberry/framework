import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { ReferrerOptionalDto } from "@gemunion/nest-js-validators";

import type { IAchievementsSignDto } from "../interfaces";

export class AchievementSignDto extends Mixin(ReferrerOptionalDto) implements IAchievementsSignDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public achievementLevelId: number;

  public account?: string;
  public chainId?: string;
}

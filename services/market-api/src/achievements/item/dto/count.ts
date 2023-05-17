import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

import { IAchievementsItemCountDto } from "../interfaces";

export class AchievementsItemCountDto implements IAchievementsItemCountDto {
  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public achievementRuleId: number;
}

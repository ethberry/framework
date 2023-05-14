import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";
import { Mixin } from "ts-mixer";

import { AccountDto, ReferrerOptionalDto } from "@gemunion/collection";

import { ISignAchievementsDto } from "../interfaces";

export class SignAchievementDto extends Mixin(AccountDto, ReferrerOptionalDto) implements ISignAchievementsDto {
  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public achievementLevelId: number;
}

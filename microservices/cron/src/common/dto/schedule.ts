import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Transform } from "class-transformer";

import { CronExpression } from "@framework/types";
import { decorate } from "ts-mixer";

export class ScheduleDto {
  @decorate(
    ApiProperty({
      type: CronExpression,
    }),
  )
  @decorate(Transform(({ value }) => value as CronExpression))
  @decorate(IsEnum(CronExpression, { message: "badInput" }))
  public schedule: CronExpression;
}

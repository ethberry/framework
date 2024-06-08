import { ApiProperty } from "@nestjs/swagger";
import { CronExpression } from "@nestjs/schedule";
import { IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { decorate } from "ts-mixer";

// TODO use from packages
export class ScheduleDto {
  @decorate(
    ApiProperty({
      enum: CronExpression,
    }),
  )
  @decorate(Transform(({ value }) => value as CronExpression))
  @decorate(IsEnum(CronExpression, { message: "badInput" }))
  public schedule: CronExpression;
}

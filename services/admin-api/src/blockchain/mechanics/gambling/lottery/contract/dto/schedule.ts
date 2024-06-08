import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { CronExpression } from "@nestjs/schedule";

import type { ILotteryScheduleUpdateDto } from "@framework/types";

// TODO extend ScheduleDto
export class LotteryScheduleUpdateDto implements ILotteryScheduleUpdateDto {
  @ApiPropertyOptional({
    enum: CronExpression,
  })
  @IsOptional()
  @Transform(({ value }) => value as CronExpression)
  @IsEnum(CronExpression, { message: "badInput" })
  public schedule: CronExpression;
}

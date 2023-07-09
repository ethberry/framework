import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { CronExpression } from "@nestjs/schedule";

import type { IRaffleScheduleUpdateDto } from "@framework/types";
import { ContractStatus } from "@framework/types";

export class RaffleScheduleUpdateDto implements IRaffleScheduleUpdateDto {
  @ApiPropertyOptional({
    enum: ContractStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as CronExpression)
  @IsEnum(CronExpression, { message: "badInput" })
  public schedule: CronExpression;
}

import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsEthereumAddress } from "class-validator";
import { Transform } from "class-transformer";
import { CronExpression } from "@nestjs/schedule";

import type { ILotteryScheduleUpdateDto } from "@framework/types";
import { ContractStatus } from "@framework/types";

export class LotteryScheduleUpdateDto implements ILotteryScheduleUpdateDto {
  @ApiProperty()
  @IsEthereumAddress({ message: "patternMismatch" })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  public address: string;

  @ApiPropertyOptional({
    enum: ContractStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as CronExpression)
  @IsEnum(CronExpression, { message: "badInput" })
  public schedule: CronExpression;
}

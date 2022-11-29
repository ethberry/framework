import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { CronExpression } from "@nestjs/schedule";

// import { ForbidEnumValues } from "@gemunion/nest-js-validators";
import { ContractStatus, ILotteryOption } from "@framework/types";

export class ScheduleUpdateDto implements ILotteryOption {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public description: string;

  @ApiPropertyOptional({
    enum: ContractStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as CronExpression)
  @IsEnum(CronExpression, { message: "badInput" })
  // @Validate(ForbidEnumValues, [ContractStatus.NEW])
  public schedule: CronExpression;
}

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min, ValidateIf, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import type { IDiscreteUpdateDto } from "@framework/types";
import { DiscreteStatus, DiscreteStrategy } from "@framework/types";
import { SemiCoinDto } from "@gemunion/nest-js-validators";

export class DiscreteUpdateDto implements IDiscreteUpdateDto {
  @ApiPropertyOptional({
    enum: DiscreteStatus,
  })
  @IsOptional()
  @Transform(({ value }) => value as DiscreteStatus)
  @IsEnum(DiscreteStatus, { message: "badInput" })
  public discreteStatus: DiscreteStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value as DiscreteStrategy)
  @IsEnum(DiscreteStrategy, { message: "badInput" })
  public discreteStrategy: DiscreteStrategy;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  @ValidateIf(o => o.discreteStrategy === DiscreteStrategy.EXPONENTIAL)
  public growthRate: number;

  @ApiPropertyOptional({
    type: SemiCoinDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SemiCoinDto)
  public price: InstanceType<typeof SemiCoinDto>;
}

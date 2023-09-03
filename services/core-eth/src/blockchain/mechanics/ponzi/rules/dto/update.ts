import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsInt, IsJSON, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

import { IPonziUpdateDto } from "../interfaces";
import { DepositDto } from "./deposit";
import { RewardDto } from "./reward";
import { DurationUnit } from "@framework/types";

export class PonziUpdateDto implements IPonziUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional({
    type: DepositDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DepositDto)
  public deposit: DepositDto;

  @ApiPropertyOptional({
    type: RewardDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RewardDto)
  public reward: RewardDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public durationAmount: number;

  @ApiPropertyOptional({
    enum: DurationUnit,
  })
  @IsOptional()
  @Transform(({ value }) => value as DurationUnit)
  @IsEnum(DurationUnit, { message: "badInput" })
  public durationUnit: DurationUnit;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public penalty: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean({ message: "typeMismatch" })
  public recurrent: boolean;
}
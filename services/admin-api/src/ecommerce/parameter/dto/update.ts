import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

import { ParameterType } from "@framework/types";

import type { IParameterUpdateDto } from "../interfaces";

export class ParameterUpdateDto implements IParameterUpdateDto {
  @ApiPropertyOptional()
  @IsString({ message: "typeMismatch" })
  public parameterName: string;

  @ApiProperty({
    enum: ParameterType,
  })
  @IsEnum(ParameterType, { message: "badInput" })
  public parameterType: ParameterType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public parameterValue: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public parameterMinValue: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public parameterMaxValue: string | null;
}

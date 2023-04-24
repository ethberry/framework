import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";

import { ParameterType } from "@framework/types";

import { IParameterCreateDto } from "../interfaces";

export class ParameterCreateDto implements IParameterCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public parameterName: string;

  @ApiProperty({
    enum: ParameterType,
  })
  @IsEnum(ParameterType, { message: "badInput" })
  public parameterType: ParameterType;

  @ApiPropertyOptional()
  @IsString({ message: "typeMismatch" })
  public parameterValue: string;

  @ApiPropertyOptional()
  @IsString({ message: "typeMismatch" })
  public parameterMinValue: string;

  @ApiPropertyOptional()
  @IsString({ message: "typeMismatch" })
  public parameterMaxValue: string;
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

import { ParameterType } from "@framework/types";

import { ICustomParameterUpdateDto } from "../interfaces";

export class CustomParameterUpdateDto implements ICustomParameterUpdateDto {
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
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

import { ParameterType } from "@framework/types";

import type { ICustomParameterCreateDto } from "../interfaces";

export class CustomParameterCreateDto implements ICustomParameterCreateDto {
  @ApiProperty()
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

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public productItemId: number;

  @ApiProperty()
  @IsInt({ message: "typeMismatch" })
  public userId: number;
}

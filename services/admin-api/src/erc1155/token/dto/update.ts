import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsJSON, IsNumberString, IsOptional, IsString, IsUrl, Min } from "class-validator";

import { Erc1155TokenStatus } from "@framework/types";

import { IErc1155TokenUpdateDto } from "../interfaces";

export class Erc1155TokenUpdateDto implements IErc1155TokenUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public attributes: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString({}, { message: "typeMismatch" })
  public price: string;

  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsUrl({}, { message: "patternMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Erc1155TokenStatus, { message: "badInput" })
  public tokenStatus: Erc1155TokenStatus;
}

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsJSON, IsNumberString, IsOptional, IsString, IsUrl, Min } from "class-validator";

import { UniTemplateStatus } from "@framework/types";

import { IErc721TemplateUpdateDto } from "../interfaces";

export class Erc721TemplateUpdateDto implements IErc721TemplateUpdateDto {
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
    type: Number,
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public erc20TokenId: number;

  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  public erc721CollectionId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UniTemplateStatus, { message: "badInput" })
  public templateStatus: UniTemplateStatus;
}

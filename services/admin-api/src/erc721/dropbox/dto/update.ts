import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsJSON, IsNumberString, IsOptional, IsString, IsUrl, Min } from "class-validator";

import { Erc721DropboxStatus } from "@framework/types";

import { IErc721DropboxUpdateDto } from "../interfaces";

export class Erc721DropboxUpdateDto implements IErc721DropboxUpdateDto {
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
  @IsNumberString({}, { message: "typeMismatch" })
  public price: string;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public erc20TokenId: number;

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
  @Min(1, { message: "rangeUnderflow" })
  public erc721CollectionId: number;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public erc721TemplateId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Erc721DropboxStatus, { message: "badInput" })
  public dropboxStatus: Erc721DropboxStatus;
}

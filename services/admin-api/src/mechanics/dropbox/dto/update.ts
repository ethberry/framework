import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsJSON, IsOptional, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { DropboxStatus } from "@framework/types";

import { IDropboxUpdateDto } from "../interfaces";
import { AssetDto } from "../../asset/dto";

export class DropboxUpdateDto implements IDropboxUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiPropertyOptional({
    type: AssetDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AssetDto)
  public price: AssetDto;

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
  public erc998CollectionId: number;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public erc998TemplateId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(DropboxStatus, { message: "badInput" })
  public dropboxStatus: DropboxStatus;
}

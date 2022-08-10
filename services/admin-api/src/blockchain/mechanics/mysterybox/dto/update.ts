import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { MysteryboxStatus } from "@framework/types";

import { IMysteryboxUpdateDto } from "../interfaces";
import { AssetDto } from "../../asset/dto";

export class MysteryboxUpdateDto implements IMysteryboxUpdateDto {
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
  public item: AssetDto;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MysteryboxStatus, { message: "badInput" })
  public mysteryboxStatus: MysteryboxStatus;
}

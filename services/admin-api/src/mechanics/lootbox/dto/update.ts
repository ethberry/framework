import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { LootboxStatus } from "@framework/types";

import { ILootboxUpdateDto } from "../interfaces";
import { AssetDto } from "../../asset/dto";

export class LootboxUpdateDto implements ILootboxUpdateDto {
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
  @IsEnum(LootboxStatus, { message: "badInput" })
  public lootboxStatus: LootboxStatus;
}

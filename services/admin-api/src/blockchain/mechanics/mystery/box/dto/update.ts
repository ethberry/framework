import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsJSON, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { MysteryboxStatus } from "@framework/types";

import { IMysteryboxUpdateDto } from "../interfaces";
import { ItemDto, PriceDto } from "../../../asset/dto";

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
    type: ItemDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

  @ApiPropertyOptional({
    type: PriceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  public price: PriceDto;

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

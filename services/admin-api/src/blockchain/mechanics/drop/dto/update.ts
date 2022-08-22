import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsISO8601, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IDropUpdateDto } from "../interfaces";
import { IsBeforeDate } from "./is-before-date";
import { ItemDto, PriceDto } from "../../asset/dto";

export class DropUpdateDto implements IDropUpdateDto {
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
  @IsString({ message: "typeMismatch" })
  @IsISO8601({ message: "patternMismatch" })
  @IsBeforeDate({ relatedPropertyName: "endTimestamp" })
  public startTimestamp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: "typeMismatch" })
  @IsISO8601({ message: "patternMismatch" })
  public endTimestamp: string;
}

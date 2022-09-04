import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsJSON, IsString, IsUrl, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IMysteryboxCreateDto } from "../interfaces";
import { ItemDto, PriceDto } from "../../../asset/dto";

export class MysteryboxCreateDto implements IMysteryboxCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty({
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  public item: ItemDto;

  @ApiProperty({
    type: PriceDto,
  })
  @ValidateNested()
  @Type(() => PriceDto)
  public price: PriceDto;

  @ApiProperty()
  @IsUrl({}, { message: "patternMismatch" })
  @IsString({ message: "typeMismatch" })
  public imageUrl: string;

  @ApiProperty({
    minimum: 1,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "rangeUnderflow" })
  public contractId: number;
}

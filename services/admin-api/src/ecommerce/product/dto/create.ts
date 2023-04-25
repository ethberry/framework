import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsJSON, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { IPhoto } from "@framework/types";

import { IProductCreateDto } from "../interfaces";
import { PhotoCreateDto } from "../../photo/dto";
import { PriceDto } from "../../../blockchain/exchange/asset/dto";

export class ProductCreateDto implements IProductCreateDto {
  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  public title: string;

  @ApiProperty()
  @IsJSON({ message: "patternMismatch" })
  public description: string;

  @ApiProperty({
    isArray: true,
    minimum: 1,
  })
  @IsInt({ each: true, message: "typeMismatch" })
  @Min(1, { each: true, message: "valueMissing" })
  public categoryIds: Array<number>;

  @ApiProperty({
    type: PriceDto,
  })
  @ValidateNested()
  @Type(() => PriceDto)
  public price: PriceDto;

  @ApiProperty({
    minimum: 0,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public amount: number;

  @ApiPropertyOptional({
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: "typeMismatch" })
  @Min(1, { message: "valueMissing" })
  public merchantId: number;

  @ApiPropertyOptional({ type: () => [PhotoCreateDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => PhotoCreateDto)
  public photos: Array<IPhoto> = [];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray({ message: "patternMismatch" })
  public parameterIds: Array<number>;
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsString, MaxLength, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import type { IPhoto } from "@framework/types";

import type { IProductItemCreateDto } from "../interfaces";
import { PhotoCreateDto } from "../../photo/dto";
import { CoinDto } from "@gemunion/nest-js-validators";

export class ProductItemCreateDto implements IProductItemCreateDto {
  @ApiProperty({
    type: CoinDto,
  })
  @ValidateNested()
  @Type(() => CoinDto)
  public price: InstanceType<typeof CoinDto>;

  @ApiProperty({
    minimum: 0,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public priceId: number;

  @ApiPropertyOptional({ type: () => PhotoCreateDto })
  @IsOptional()
  @IsArray({ message: "typeMismatch" })
  @ValidateNested()
  @Type(() => PhotoCreateDto)
  public photo: IPhoto;

  @ApiProperty({
    minimum: 0,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public productId: number;

  @ApiProperty({
    minimum: 0,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public maxQuantity: number;

  @ApiProperty({
    minimum: 0,
  })
  @IsInt({ message: "typeMismatch" })
  @Min(0, { message: "rangeUnderflow" })
  public minQuantity: number;

  @ApiProperty()
  @IsString({ message: "typeMismatch" })
  @MaxLength(32, { message: "rangeOverflow" })
  public sku: string;
}
